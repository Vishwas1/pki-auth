import { Router } from 'express';
import didCtrl from '../controllers/did';

const router = Router()

// GET:  /api/did/create?name=
router.get('/create', didCtrl.create)

// POST: /api/did/update
router.post('/update', didCtrl.update)

// GET:  /api/did/resolve?did=
router.get('/resolve', didCtrl.resolve)


export default router


