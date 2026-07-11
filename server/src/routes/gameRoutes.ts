import { Router } from 'express';
import { startNewGame, validateGuess } from '../controllers/gameController';

const router = Router();
router.post('/start', startNewGame);
router.post('/guess', validateGuess);

export default router;