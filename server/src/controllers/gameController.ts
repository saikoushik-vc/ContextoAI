import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Global cache for the current game
let currentRankCache: Map<string, number> = new Map();

// Helper: Cosine Similarity
function getSimilarity(vecA: number[], vecB: number[]) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

export const startNewGame = async (req: Request, res: Response) => {
  try {
    // 1. Fetch only necessary fields
    const rawWords = await prisma.wordVector.findMany({
      select: { word: true, vector: true }
    });

    // 2. De-duplicate
    const uniqueMap = new Map();
    rawWords.forEach(w => {
      const norm = w.word.toLowerCase().trim();
      if (!uniqueMap.has(norm)) uniqueMap.set(norm, w.vector);
    });

    const words = Array.from(uniqueMap.entries());
    if (words.length === 0) return res.status(404).json({ error: 'Database empty' });

    // 3. Pick random target
    const targetIndex = Math.floor(Math.random() * words.length);
    const [targetWord, targetVector] = words[targetIndex];

    // 4. Calculate similarities
    const similarities = words.map(([word, vector]) => ({
      word,
      score: getSimilarity(vector as number[], targetVector as number[])
    }));

    // 5. Sort: Descending (Higher score = closer)
    similarities.sort((a, b) => b.score - a.score);
    
    // 6. Build new map
    const newMap = new Map<string, number>();
    similarities.forEach((item, index) => {
      newMap.set(item.word, index + 1);
    });

    // 7. FORCE: Ensure target is Rank 1
    newMap.set(targetWord.toLowerCase(), 1);

    currentRankCache = newMap;

    console.log(`Server: New target is "${targetWord}"`);
    res.json({ message: 'Game started!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to start' });
  }
};

export const validateGuess = (req: Request, res: Response) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: 'Missing word' });

  const normalized = word.toLowerCase().trim();
  const rank = currentRankCache.get(normalized);
  
  if (rank === undefined) {
    return res.status(404).json({ error: 'Word not found' });
  }
  
  res.json({ 
    word: normalized, 
    rank: rank, 
    isWinner: rank === 1 
  });
};