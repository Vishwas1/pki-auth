import { Router } from 'express'
import * as appCtrl from '../controllers/app'
import verifyAuth from '../middleware/auth'


const router = Router()
// router.post('/register', verifyAuth, appCtrl.registerApp)
router.post('/register',  verifyAuth, appCtrl.registerApp)
router.post('/oauth', appCtrl.validateApp)
router.post('/login', verifyAuth, appCtrl.login)
// router.post('/list', verifyAuth, appCtrl.getAppList)
router.post('/list',  verifyAuth, appCtrl.getAppList)
export default router


