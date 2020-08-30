import { Router } from 'express'
import info from '../controllers/info.controller';
const router = Router()
router.get('/', info);
export default router