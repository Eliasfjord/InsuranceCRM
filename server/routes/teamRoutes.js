import { Router } from 'express';
import Team from '../controllers/team';
import auth from '../middlewares/auth';
const router = Router();

router.post('/add', auth, Team.add);
router.get('/list', auth, Team.list);
router.post('/assign/:teamId/:userId', auth, Team.assign);

export default router;
