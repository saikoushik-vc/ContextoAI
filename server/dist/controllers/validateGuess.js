"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGuess = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Helper to normalize input (trim, lowercase)
// v1.5 Note: Future versions will add lemmatization here
const normalizeInput = (word) => word.trim().toLowerCase();
const validateGuess = async (req, res) => {
    const { word } = req.body;
    if (!word)
        return res.status(400).json({ error: 'Guess is required' });
    const normalizedWord = normalizeInput(word);
    try {
        // Look up the word in our database
        const entry = await prisma.wordVector.findUnique({
            where: { word: normalizedWord },
        });
        if (!entry) {
            return res.status(404).json({ error: 'Word not found in dictionary' });
        }
        // In a full implementation, we would compare the vector here.
        // For now, we return the successful lookup.
        res.json({
            status: 'success',
            word: entry.word,
            message: 'Word validated successfully'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateGuess = validateGuess;
