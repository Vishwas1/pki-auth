import { Router } from 'express'
import * as appCtrl from '../controllers/app'
const router = Router()


router.post('/register', appCtrl.registerApp)



export default router


