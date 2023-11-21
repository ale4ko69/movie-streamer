// @ts-nocheck
import http from 'http'
import url from 'url'
import * as cheerio from 'cheerio';
import * as windows1251 from 'windows-1251'
import { instAxios } from '#services/axios.js'


class KinopoiskApi {
    constructor(data = null) {
      this.page    = 1
      this.baseUrl = 'https://www.kinopoisk.ru'
      this.streamHost = 'https://flicksbar.lol'
      this.search_path = 's/type/film/list/1/find/{query}/order/relevant/page/{page}'
      this.movie_path = 'film/{m_id}/'
      this.movie_posters_path = 'film/{m_id}/posters'
      this.cookie = null
      this.parseData = true
    }

    async search (_query) {
        if (typeof _query === 'undefined') {
          throw TypeError('Expected at least one argument')
        }
        const query = encodeURIComponent(_query)
        const path = this.search_path.replace("{query}", query).replace("{page}", this.page)

        const searchKinopoiskURL = `${this.baseUrl}/${path}`

        const _res = await getRequest(searchKinopoiskURL, this.cookie)
        // await instAxios.get(searchKinopoiskURL, {
        //   withCredentials: true,
        //   responseType:'arraybuffer',
        //   headers: {
        //     Cookie: this.cookie,
        //   },
        // })

        if (_res.status !== 200) {
          return
        }

        this.cookie = _res.headers['set-cookie']

        const html = _res.data.toString('UTF-8')

        if (this.parseData) {
            const parsedSearch = this.parseSearch(html)
            return parsedSearch
        }
    }

    async getMovieInfo (m_id) {

      const path = this.movie_path.replace("{m_id}", m_id)
      const infoKinopoiskURL = `${this.baseUrl}/${path}`

      const _res = await instAxios.get(infoKinopoiskURL, {
        withCredentials: true,
        responseType:'arraybuffer',
        headers: {
          Cookie: this.cookie,
        },
      })

      if (_res.status !== 200) {
        return
      }

      const html = _res.data.toString('UTF-8')

      if (this.parseData) {
          const parsedSearch = this.parseInfo(html)
          return parsedSearch
      }
    }

    async streamsUrlMovie(m_id) {
        const strStreamURL = `${this.streamHost}/kinobox/index.php?kinopoisk=${m_id}`
        const _responseMenu = await instAxios.get(strStreamURL)
        const jsonMenu = _responseMenu.data.success ? _responseMenu.data.data : []

        return jsonMenu
    }

    async parseSearch(rawHtml) {
        const $ = cheerio.load(rawHtml, { decodeEntities: false })
        const tracks = $('.element')
        const results = []

        for (const track of tracks) {
            const currentTrack = $(track)
            // const poster = currentTrack.find('p.pic img.flap_img')
            const info = currentTrack.find('div.info')
            const title = info.find('p.name a')
            // If ID exists in DB do not get Data
            const strId = title.attr('data-id') ?? ''
            // Get Next track
            const year = info.find('span.year')
            const origTitle = info.find('p.name').next()
            const country_director = origTitle.next()
            const arrOrigTitleDuration = origTitle.text().split(',')

            const arrPoster = []//await this.getPosters(strId)//`${this.baseUrl}${poster.attr('title')}`
            const strTitle = title.text() ?? ''
            const strDuration = arrOrigTitleDuration.pop()?.trim()
            const strOrigTitle = arrOrigTitleDuration?.join(',') ?? ''
            const strDirector = info.find('.director').text() ?? ''
            const strCountryDirectorCategory = country_director.text()
            const strYear = year.text()

            const strMoviePageUrl = `${this.baseUrl}/${this.movie_path.replace('{m_id}', strId)}`

            if (strTitle !== '' && strId) {

                const regxpDirector = /(реж\.\s)/gim
                const strFormattedDirector = strDirector.replace(regxpDirector, '').trim()
                const regxpCategory = /(?:[\w\W]+)(?:\t\()(?<category>.+)(?:\)\n)/gi
                const matchedCategory = strCountryDirectorCategory.replace(regxpCategory, '$<category>').trim()
                const strCountry = strCountryDirectorCategory.replace(/^(?<country>\D[^\.,\(\t\n]+)(?:.+)/gim, '$<country>').trim()

                const objMovie = {
                    m_id: strId,
                    m_poster: arrPoster,
                    m_title: strTitle,
                    m_orig_title: strOrigTitle,
                    m_category: matchedCategory,
                    m_duration: strDuration,
                    m_country: strCountry,
                    m_director: strFormattedDirector,
                    m_cast: [],
                    m_description: '',
                    m_year: strYear,
                    m_move_page_url: strMoviePageUrl,
                    m_stream_menu: [],
                }
                results.push(objMovie)
            }

        }

        return results
    }

    async parseInfo (rawHtml) {
      const $ = cheerio.load(rawHtml, { decodeEntities: false })
      const tracks = $('.element')


    }

    async getPosters(m_id) {

        const path = this.movie_posters_path.replace("{m_id}", m_id)
        const infoKinopoiskURL = `${this.baseUrl}/${path}`

        const _res = await getRequest(infoKinopoiskURL, this.cookie)

        if (_res.status !== 200) {
          return
        }

        const html = _res.data.toString('UTF-8')

        if (this.parseData) {
          let $ = cheerio.load(html, { decodeEntities: false })
          const galleryUrl = $('div[class*=styles_gallery] a').attr('href')

          const _postersRes = await getRequest(galleryUrl, this.cookie)
          const htmlPosters = _postersRes.data.toString('UTF-8')
          const arrPosters = []

          $ = cheerio.load(htmlPosters, { decodeEntities: false })
          const posters = $('div[class*=styles_cover]')
          for (const poster of posters) {
            const currentPoster = $(poster)
            const imgUrl = currentPoster.attr('src')?.replace('/180', '/800')
            arrPosters.push(imgUrl)
          }

          return arrPosters
        }
    }
}

 function getRequest(url, cookie) {
  return instAxios.get(url, {
    withCredentials: true,
    responseType:'arraybuffer',
    headers: {
      Cookie: cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
    },
  })
}

export const kinopoiskapi = new KinopoiskApi()
