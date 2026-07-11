import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Explicitly allow your frontend origin (usually port 5173 for Vite)
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/game', gameRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Contexto API is live' });
});

// Start the server
app.listen(Number(PORT), () => {
  console.log(`Server live at http://localhost:${PORT}`);
});