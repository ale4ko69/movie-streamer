import { Router } from 'express'
import { searchMovieTorrent, categoryMovieTorrent, getMovieTorrentInfo, searchKinoMovie, streamsMovie } from '../modules/movies/movies.controller.js'

const router: Router = Router({ mergeParams: true, strict: true })

//Torrents
router.get('/search', searchMovieTorrent)
router.get('/movieinfo', getMovieTorrentInfo)

//Kinopoisk
router.get('/kinosearch', searchKinoMovie)

//Contents
router.get('/streams', streamsMovie)
router.get('/category', categoryMovieTorrent)

export default router
