const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importRanks() {
  const filePath = path.join(__dirname, '../../ai_pipeline/output_ranks.csv');
  const data = fs.readFileSync(filePath, 'utf-8');
  const lines = data.split('\n');

  for (const line of lines) {
    const [word, rank] = line.split(',');
    if (word && rank) {
      try {
        await prisma.wordVector.updateMany({
          where: { word: word.trim().toLowerCase() },
          data: { rank: parseInt(rank) }
        });
      } catch (e) {
        console.error(`Failed to update ${word}:`, e.message);
      }
    }
  }
  console.log("Ranking import complete!");
}

importRanks().catch(console.error).finally(() => prisma.$disconnect());