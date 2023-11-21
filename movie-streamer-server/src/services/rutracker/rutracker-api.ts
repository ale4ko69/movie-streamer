// @ts-nocheck
import http from 'http'
import url from 'url'
import axios from 'axios'
import * as cheerio from 'cheerio';
import * as windows1251 from 'windows-1251'
import EventEmitter from 'events'
import { instAxios } from '#services/axios.js'
import { IRutrackerApi, TSearchMovies, TSearchMoviesObject } from './Irutracker-api.js'
import { rutrackerCategories, genres } from './rutracker-categories.js'
import { rutrackerMoviesInfo, addMovie } from './rutracker-movies-info.js'
import { IMovieInfo } from '#modules/movies/movies.interface.js'
import { searchInIMDB } from '#modules/movies/imdb.controller.js'

const stateTorrent = {
  NE_PROVERENO: 'не проверено',
  PROVERKA: 'проверяется',
  PROVERENO: 'проверено',
  NEDOOFORMLENA: 'недооформлено',
  NE_OFORMLENO: 'не оформлено',
  POVTOR: 'повтор',
  CLOSED_COPYRIGHT: 'закрыто правообладателем',
  CLOSED: 'закрыто',
  TEMPORARY: 'временная',
  ABSORBED: 'поглощено',
  DOUBTFUL: 'сомнительно',
  PRE_MODERATION: 'премодерация',
}

function createLoginInstance() {
  // ---- New instance Axios for login
  const loginInstance = axios.create({
    maxRedirects: 0,
    withCredentials: true,
  })

  loginInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && [301, 302].includes(error.response.status)) {
        return (this.cookie = error.response.headers['set-cookie'])
      }
      return Promise.reject(error)
    }
  )

  return loginInstance
}

class RutrackerApi {
  constructor(data = null) {
    this.baseUrl = 'https://rutracker.org'
    this.host = 'rutracker.org'
    this.login_host = 'rutracker.org'
    this.login_path = '/forum/login.php'
    this.search_path = '/forum/tracker.php'
    this.movie_path = '/forum/viewtopic.php'
    this.download_path = '/forum/dl.php'
    this.cookie = null
    this.parseData = true
    this.eventEmitter = new EventEmitter()
    if (data?.username && data?.password) {
      this.username = data?.username
      this.password = data?.password
      this.login()
    }
  }

  async login(username = '', password = ''): boolean {

    if (Array.isArray(rutrackerapi.cookie)) {
      console.log(`User already logged in`)
      return true
    }

    const getLoginInstance = createLoginInstance.bind(this)
    const loginInstance = getLoginInstance()

    const postData = {
      login_username: username || this.username,
      login_password: password || this.password,
      login: 'Вход',
    }

    const strPostData = new url.URLSearchParams(postData)

    const loginRutrackerURL = `${this.baseUrl}${this.login_path}`

    const _res = await loginInstance.post(loginRutrackerURL, strPostData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': strPostData.length,
      },
    })

    console.log(`Login cridential: ${strPostData}`)

    if (Array.isArray(_res) && this.cookie) {
      // this.eventEmitter.emit('login')
      return true
    } else {
      // this.eventEmitter.emit('login-error')
      return false
    }
  }

  async search(_category, _query, _callback) {
    // TODO Return Errors
    if (!Array.isArray(this.cookie)) {
      throw Error('Unauthorized: Use `login` method first')
    }
    else if (typeof _query === 'undefined' && typeof _category === 'undefined') {
      throw TypeError('Expected at least one argument')
    }

    const category = _category ? `f=${_category}&` : ''
    const callback = _callback || null
    const query = encodeURIComponent(_query)
    const path = `${this.search_path}?${category}nm=${query}`

    const searchRutrackerURL = `${this.baseUrl}/${path}`

    const _res = await instAxios.get(searchRutrackerURL, {
      withCredentials: true,
      responseType: 'arraybuffer',
      headers: {
        Cookie: this.cookie,
      },
    })

    if (_res.status !== 200) {
      return
    }

    const data = _res.data.toString('binary')
    const html = windows1251.decode(data)

    if (this.parseData) {
      const parsedSearch = this.parseSearch(html, callback)
      if (!callback) {
        return parsedSearch
      }
    } else {
      callback(html)
    }
  }

  async getMovieInfo(_id): IMovieInfo | null {
    if (!Array.isArray(this.cookie)) {
      throw Error('Unauthorized: Use `login` method first')
    }
    else if (typeof _id === 'undefined') {
      throw TypeError('Expected at least one argument')
    }

    // Check if information alrady exists
    if (rutrackerMoviesInfo[_id]) {
      console.log(`Movie Info exists in DB`, rutrackerMoviesInfo[_id])
      return rutrackerMoviesInfo[_id]
    }

    const path = `${this.movie_path}?t=${_id}`
    const movieRutrackerURL = `${this.baseUrl}/${path}`

    const _res = await instAxios.get(movieRutrackerURL, {
      withCredentials: true,
      responseType: 'arraybuffer',
      headers: {
        Cookie: this.cookie,
      },
    })

    if (_res.status !== 200) {
      return null
    }

    const data = _res.data.toString('binary')
    const html = windows1251.decode(data)

    if (html) {
      return this.parseMovieInfo(html, _id)
    }

    return null
  }

  async download(_id) {
    if (typeof this.cookie !== 'string') {
      throw Error('Unauthorized: Use `login` method first')
    } else if (typeof _id === 'undefined') {
      throw TypeError('Expected at least one argument')
    }

    const callback = _callback || (() => { })
    const path = `${this.download_path}?t=${_id}`

    const options = {
      hostname: this.host,
      port: 80,
      path,
      method: 'GET',
      headers: {
        Cookie: this.cookie,
      },
    }

    const that = this
    const req = http.request(options, function (res) {
      if (res.statusCode === '200') {
        callback(res)
      } else {
        throw Error(`HTTP code is ${res.statusCode}`)
      }
    })

    req.on('error', function (err) {
      that.eventEmitter.emit('error', err)
    })
    req.end()
  }

  parseSearch(rawHtml, callback) {
    const $ = cheerio.load(rawHtml, { decodeEntities: false })
    const tracks = $('#tor-tbl tbody').find('tr')
    const results = <TSearchMovies>[]
    const verifiedState = [stateTorrent.PROVERENO, stateTorrent.NEDOOFORMLENA, stateTorrent.DOUBTFUL]

    for (const track of tracks) {
      const currentTrack = $(track)
      const document = currentTrack.find('td')
      const state = document.next()
      const category = state.next()
      const title = category.next()
      const author = title.next()
      const size = author.next()
      const seeds = size.next()
      const leechs = seeds.next()

      const strTitle = title.find('div a ').html() ?? ''
      const strState = state.attr('title') ?? ''
      const strId = title.find('div a').attr('data-topic_id') ?? ''
      const strCategory = category.find('.f-name a').html() ?? ''
      const strSeeds = seeds.find('b').html() ?? ''
      const strLeechs = leechs.find('b').html() ?? ''
      const strURL = `https://${this.host}/forum/${title.find('div a').attr('href')}`

      if (strTitle !== '' && verifiedState.includes(strState)) {

        const Cat = rutrackerCategories.find((cat) => cat.catName === strCategory) || null
        const strSize = cleanSizeData(size.find('a.dl-stub').text()) as string
        const rgexp = /(?<=\d">)(.[^\(]+)/gim
        const _Title = title.find('div').html()
        const matchTitle = _Title.match(rgexp)

        const objMovie = <TSearchMoviesObject>{
          m_state: strState,
          m_category: strCategory,
          m_categoryId: Cat?.catId,
          m_id: strId,
          m_title: strTitle,
          m_size: strSize,
          m_seeds: strSeeds,
          m_leechs: strLeechs,
          m_url: strURL
        }

        const movieInfo = searchInIMDB(matchTitle[0].trim())

        results.push(objMovie)
      }

      function cleanSizeData(strSize) {
        const formated = strSize.replace(/ ↓/gi, '')
        return formated.toString() ?? ''
      }
    }

    if (callback) callback(results)
    else return results
  }

  parseMovieInfo(rawHtml: any, _id: number): IMovieInfo | null {
    const $ = cheerio.load(rawHtml, { decodeEntities: false })
    const results: IMovieInfo = {
      m_id: _id,
      m_title: '',
      m_poster: '',
      m_country: '',
      m_genre: '',
      m_year: 0,
      m_duration: '',
      m_translate: '',
      m_subtitle: '',
      m_originalAudio: '',
      m_director: '',
      m_cast: '',
      m_description: '',
      m_formatVideo: '',
      m_qualityVideo: '',
      m_torrent: _id,
      m_magnet: '',
    }

    const body = $('.post_body');

    if (body) {

      let m_title = body.children('span').first().text();

      m_title = m_title?.replace(/\n/gmi, ' / ')

      let m_poster = body.find('img.postImg').attr('src');

      if(!m_poster) {
        m_poster = body.find('var.postImg').first().attr('title')
      }

      const body_Links = $('table.attach');
      const m_magnet = body_Links.find('a.magnet-link').attr('title')

      let body_Info = body.first().html()
      // let body_Info = body.find('.post-font-serif1').children('span').first().html()


      body_Info = body_Info.replace(/\<hr class\=\"post-hr\"\>/gmi, '\n') //---- Convert hr to new line symbol
      body_Info = body_Info.replace(/\<span class\=\"post-br\"\>(\<br\>)?\<\/span\>/gmi, '\n') //---- Convert span.br to new line symbol
      body_Info = body_Info.replace(/\:\n?<br>\\n?/gmi, ': ') //---- Remove unneeded new line and br after :

      let body_Info_Text = $(body_Info).text()
      body_Info_Text = body_Info_Text.replace(/\:\n/gmi, ': ') //---- Remove unneeded new line beetwen : and Value
      const arrInfo = [...new Set(body_Info_Text.split('\n'))]

      results.m_magnet = m_magnet
      results.m_title = m_title
      results.m_poster = m_poster

      if (Array.isArray(arrInfo)) {
        arrInfo.forEach((item) => {
          const [itemInfo, value] = item.split(': ');
          switch (itemInfo) {
            case 'Страна':
              results.m_country = value
              break;
            case 'Год выпуска':
              results.m_year = value
              break;
            case 'Жанр':
              results.m_genre = this.convertGenresStrToArrId(value)
              break;
            case 'Продолжительность':
              results.m_duration = value
              break;
            case 'Перевод':
            case 'Перевод 1':
            case 'Перевод 2':
            case 'Перевод 3':
              results.m_translate = results.m_translate ? `${results.m_translate}; ${value}` : value
              break;
            case 'Субтитры':
              results.m_subtitle = value
              break;
            case 'Оригинальная аудиодорожка':
            case 'Аудио 1':
            case 'Аудио 2':
            case 'Аудио 3':
            case 'Аудио 4':
              results.m_originalAudio = results.m_originalAudio ? `${results.m_originalAudio}; ${value}` : value
              break;
            case 'Режиссер':
            case 'Режиссёр':
              results.m_director = value
              break;
            case 'В ролях':
              results.m_cast = value
              break;
            case 'Описание':
              results.m_description = value
              break;
            case 'Качество видео':
            case 'Качество':
              results.m_qualityVideo = value
              break;
            case 'Формат видео':
            case 'Видео':
              results.m_formatVideo = value
              break;
            default:
              break;
          }
        })
      }
      if (!rutrackerMoviesInfo[_id]) {
        addMovie(_id, results)
      }
      return results
    }

    return null;
  }

  convertGenresStrToArrId(strCategory: string): [number] | [] {
    if(!strCategory) return [];

    const arrGenreIds = [];
    const arrStrGenres = strCategory.split(',')

    arrStrGenres.forEach((item: string) => {
      const jName: string = item.trim().toLowerCase()

      const j = genres.find((j) =>{
        if (j.name_ru.trim().toLowerCase() === jName){
          return j
        }
        return null
      })

      if(j) arrGenreIds.push(j.id)
    })

    return arrGenreIds

  }
}

export const rutrackerapi: IRutrackerApi = new RutrackerApi()
