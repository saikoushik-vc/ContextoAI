-- CreateTable
CREATE TABLE "WordVector" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "vector" DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordVector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordVector_word_key" ON "WordVector"("word");
