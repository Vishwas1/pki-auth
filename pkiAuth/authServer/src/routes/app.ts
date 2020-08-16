import { Router } from 'express'
import * as appCtrl from '../controllers/app'
import verifyAuth from '../middleware/auth'


const router = Router()
router.post('/register', appCtrl.registerApp)
router.post('/oauth', appCtrl.validateApp)
router.get('/login', verifyAuth, appCtrl.login);
export default router


