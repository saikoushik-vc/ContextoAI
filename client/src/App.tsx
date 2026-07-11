import { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/game' });

function App() {
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [status, setStatus] = useState('Click "Start New Game" to begin.');

  const startGame = async () => {
    try {
      await api.post('/start');
      setHistory([]);
      setStatus('Game started! Start guessing.');
    } catch (e) {
      setStatus('Error starting game.');
    }
  };

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    try {
      const { data } = await api.post('/guess', { word: guess });
      setHistory(prev => [data, ...prev]);
      setStatus(data.isWinner ? 'You won!' : `Rank: #${data.rank}`);
      setGuess('');
    } catch (e) {
      alert('Word not found in dictionary!');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Contexto AI</h1>
      <p><strong>{status}</strong></p>
      <button onClick={startGame} style={{ padding: '10px 20px' }}>Start New Game</button>

      <form onSubmit={handleGuess} style={{ margin: '20px 0' }}>
        <input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Enter a word" />
        <button type="submit">Guess</button>
      </form>

      <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'left' }}>
        {history.map((h, i) => (
          <div key={i} style={{ padding: '5px', borderBottom: '1px solid #ccc' }}>
            {h.word.toUpperCase()} — Rank: <strong>#{h.rank}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;