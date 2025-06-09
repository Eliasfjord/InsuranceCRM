import { Router } from 'express';
import Stats from '../controllers/statistics';
import auth from '../middlewares/auth';

const router = Router();

router.get('/overview', auth, Stats.overview);

export default router;
