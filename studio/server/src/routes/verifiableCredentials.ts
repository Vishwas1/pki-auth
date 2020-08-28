import { Router } from 'express'
import * as appCtrl from '../controllers/verifiableCredentials'
import verifyAuth from '../middleware/auth'

const router = Router()
router.post('/issue',  verifyAuth, appCtrl.issueCredential)
router.get('/list',  verifyAuth, appCtrl.getCredentialList)
export default router


