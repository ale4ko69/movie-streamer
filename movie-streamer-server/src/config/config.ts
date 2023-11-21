
const config = {
  rutrackerCredential: {
    username: process.env.RUTRACKER_USERNAME || '',
    password: process.env.RUTRACKER_PASSWORD || ''
  },
  imdb: {
    api_key: process.env.TMDb_API_KEY || '',
    api_url: process.env.TMDB_API_URL || '',
    language: 'ru'
  },
  kinopoisk: {
    base_url: "https://www.kinopoisk.ru",
    movie_search_list: "s/type/film/list/1/find/{query}/order/relevant/page/{page_num}/"
  },
  nedb: {
    path: './db/movieInfo.db'
  }
}

export default config
