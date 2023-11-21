import { Router } from 'express'
import { contentHome } from '../modules/content/content.controller.js'

const router: Router = Router({ mergeParams: true, strict: true })

router.get('/', contentHome)

export default router
