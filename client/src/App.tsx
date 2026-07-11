import { useState } from 'react';
import axios from 'axios';

function App() {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleGuess = async () => {
    if (!guess.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/validate', { word: guess });
      setFeedback(`Great! "${response.data.word}" exists in our database.`);
      setGuess(''); // Clear input
    } catch (error: any) {
      if (error.response?.status === 404) {
        setFeedback("That word isn't in our list. Try another!");
      } else {
        setFeedback("Server error. Check your connection.");
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Contexto AI</h1>
      <input 
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess..."
        style={{ padding: '10px', width: '70%' }}
      />
      <button onClick={handleGuess} style={{ padding: '10px' }}>Submit</button>
      <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{feedback}</p>
    </div>
  );
}

export default App;