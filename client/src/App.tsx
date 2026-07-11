import { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/game' });

function App() {
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const startGame = async () => {
    await api.post('/start');
    setHistory([]);
  };

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/guess', { word: guess });
      setHistory(prev => [data, ...prev].sort((a, b) => a.rank - b.rank));
      setGuess('');
    } catch (e) { alert('Word not found'); }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">Contexto AI</h1>
      
      <div className="w-full max-w-md bg-[#2d2d2d] p-6 rounded-2xl shadow-xl">
        <button onClick={startGame} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition">
          New Game
        </button>

        {/* Warmer/Colder Bar */}
        <div className="my-6">
          <p className="text-sm text-gray-400 mb-2 text-center">Warmer/Colder</p>
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-500 to-red-500"></div>
        </div>

        <form onSubmit={handleGuess} className="flex gap-2 mb-6">
          <input 
            value={guess} onChange={(e) => setGuess(e.target.value)}
            className="flex-1 bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 outline-none focus:border-green-500"
            placeholder="Enter a word..."
          />
          <button type="submit" className="bg-green-600 px-6 rounded-lg font-bold hover:bg-green-500">Guess</button>
        </form>

        {/* History List */}
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className={`p-3 rounded-lg flex justify-between ${h.rank === 1 ? 'bg-green-900 border border-green-500' : 'bg-[#1a1a1a]'}`}>
              <span className="font-medium">{h.word.toUpperCase()}</span>
              <span className="text-gray-400">Rank #{h.rank} {h.rank === 1 && '⭐'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;