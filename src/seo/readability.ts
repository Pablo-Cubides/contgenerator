export interface ReadabilityResult {
  score: number;
  level: string;
}

export function calculateReadability(text: string): ReadabilityResult {
  if (!text) return { score: 0, level: "Muy difícil" };

  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  if (wordCount === 0 || sentenceCount === 0) return { score: 0, level: "Muy difícil" };

  let syllableCount = 0;
  for (const word of words) {
    const cleanWord = word.toLowerCase().replace(/[^a-zñáéíóúü]/g, '');
    const syllables = cleanWord.match(/[aeiouáéíóúü]+/g);
    syllableCount += syllables ? syllables.length : 1;
  }

  // Szigriszt-Pazos formula for Spanish
  const score = 206.835 - (62.3 * (syllableCount / wordCount)) - (wordCount / sentenceCount);
  const roundedScore = Math.max(0, Math.min(100, Math.round(score)));

  let level = "Muy difícil";
  if (roundedScore > 90) level = "Muy fácil";
  else if (roundedScore > 80) level = "Fácil";
  else if (roundedScore > 60) level = "Bastante fácil";
  else if (roundedScore > 50) level = "Normal";
  else if (roundedScore > 30) level = "Difícil";

  return { score: roundedScore, level };
}
