import { Router, Request, Response } from 'express';
import authCtrl from '../controllers/auth'


const router = Router();
router.get('/', authCtrl.check)

router.post('/register', authCtrl.register)
router.post('/login', authCtrl.login)
router.post('/recover', authCtrl.recover)

export default router;