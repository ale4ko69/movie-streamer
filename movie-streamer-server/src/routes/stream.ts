import { Request, Router } from 'express'
import { streamHome, streamState, streamAdd, streamVideo } from '../modules/stream/stream.controller.js'

const router: Router = Router({ mergeParams: true, strict: true })

router.get('/', streamHome)
router.get('/state', streamState)
router.get('/add/:magnet', streamAdd)
router.get('/video/:magnet/:fileName', streamVideo)

export default router
