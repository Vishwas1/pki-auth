import { Router, Request, Response } from 'express';
import authCtrl from '../controllers/auth';
import verifyAuth from '../middleware/auth'


const router = Router();
router.get('/', authCtrl.check)
router.post('/register', authCtrl.register)
router.post('/login', authCtrl.login)
router.post('/login_pki', verifyAuth, authCtrl.login)
router.post('/recover', authCtrl.recover)
router.get('/challenge', authCtrl.getNewChallenge)
router.post('/verify', verifyAuth , (req, res) => {
    res.status(200).send({
        status: 200,
        message: { 
            m: "The token is verified",
            user: res.locals.data
        },
        error: null
    })
})

export default router;