import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Memory cache for the current session
let activeTarget = { word: '', vector: [] as number[] };
let rankCache: Map<string, number> = new Map();

const getSimilarity = (vecA: number[], vecB: number[]) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
};

export const startNewGame = async (req: Request, res: Response) => {
  try {
    const allWords = await prisma.wordVector.findMany();
    const target = allWords[Math.floor(Math.random() * allWords.length)];
    activeTarget = { word: target.word, vector: target.vector };

    // Pre-calculate all ranks for this new target
    const similarities = allWords.map(w => ({
      word: w.word,
      score: getSimilarity(w.vector, activeTarget.vector)
    }));

    // Sort descending by score (highest similarity = rank 1)
    similarities.sort((a, b) => b.score - a.score);
    
    // Build the cache: word -> rank (index + 1)
    rankCache = new Map(similarities.map((item, index) => [item.word, index + 1]));

    res.json({ message: 'Game started!' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to start game' });
  }
};

export const validateGuess = async (req: Request, res: Response) => {
  const { word } = req.body;
  const normalized = word.toLowerCase().trim();

  if (!rankCache.has(normalized)) {
    return res.status(404).json({ error: 'Word not found in dictionary' });
  }

  const rank = rankCache.get(normalized);
  const isWinner = rank === 1;

  res.json({ 
    word: normalized, 
    rank: rank, 
    isWinner,
    message: isWinner ? 'You found it!' : 'Keep guessing' 
  });
};