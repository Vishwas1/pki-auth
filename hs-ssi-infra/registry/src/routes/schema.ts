import { Router } from 'express';
import didCtrl from '../controllers/schema';

const router = Router()

// GET:  /api/did/create?name=
router.post('/create', didCtrl.create)

// POST: /api/did/update
// Only owner should be able to update
router.post('/update', didCtrl.update)

// GET:  /api/did/resolve?did=
router.get('/get', didCtrl.get)

router.get('/get/:schemaId', didCtrl.getRaw)

router.get('/list', didCtrl.list)

export default router


