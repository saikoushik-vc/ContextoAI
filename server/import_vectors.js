const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function importVectors() {
  const csvPath = path.join(__dirname, "../ai_pipeline/output_ranks.csv");
  const data = fs.readFileSync(csvPath, "utf8");
  
  const lines = data.split('\n').slice(1);
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Split by first comma only
    const idx = line.indexOf(',');
    const word = line.substring(0, idx).trim();
    const vectorStr = line.substring(idx + 1).trim();
    
    try {
      const parsed = JSON.parse(vectorStr);
      // Ensure it is an array
      const vector = Array.isArray(parsed) ? parsed : [];
      // Ensure all elements are actual floats
      const floatVector = vector.map(v => parseFloat(v));

      await prisma.wordVector.upsert({
        where: { word: word },
        update: { vector: floatVector },
        create: { word: word, vector: floatVector }
      });
      console.log(`Successfully imported: ${word}`);
    } catch (e) {
      console.error(`Error processing ${word}:`, e.message);
    }
  }
}

importVectors().finally(() => prisma.$disconnect());