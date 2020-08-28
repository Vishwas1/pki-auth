import { Router } from 'express'
import * as appCtrl from '../controllers/app'
import verifyAuth from '../middleware/auth'


const router = Router()
// router.post('/register', verifyAuth, appCtrl.registerApp)
router.post('/register',  verifyAuth, appCtrl.registerApp)
router.post('/oauth', appCtrl.validateApp)
router.post('/login', verifyAuth, appCtrl.login)
router.get('/:appId', verifyAuth, appCtrl.getOne);
router.post('/list',  verifyAuth, appCtrl.getAppList)
export default router


