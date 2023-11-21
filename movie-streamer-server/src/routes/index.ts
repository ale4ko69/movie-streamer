import { Router } from 'express'
import streamRoute from './stream.js'
import contentRoute from './content.js'
import moviesRoute from './movies.js'

const router: Router = Router({ mergeParams: true, strict: true })

router.use(`/stream`, streamRoute)
router.use(`/content`, contentRoute)
router.use(`/movies`, moviesRoute)

export default router
