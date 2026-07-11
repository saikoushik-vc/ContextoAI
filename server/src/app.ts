import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Everything goes through /api/game/start or /api/game/guess
app.use('/api/game', gameRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server live at http://localhost:${PORT}`);
});