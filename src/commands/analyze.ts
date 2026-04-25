import fs from 'fs';
import path from 'path';
import { fetchAutocomplete, fetchSerp } from '../seo/serp';

export async function analyzeKeyword(keyword: string) {
  console.log(`\n🚀 Analizando keyword: "${keyword}" al nivel SEMrush...\n`);

  console.log(`⏳ Consultando Google Autocomplete...`);
  const suggestions = await fetchAutocomplete(keyword);
  
  console.log(`⏳ Analizando el Top 10 de Google (SERP)...`);
  const serp = await fetchSerp(keyword);

  const analysis = {
    keyword,
    date: new Date().toISOString(),
    suggestions,
    competitors: serp.map(s => ({
      title: s.title,
      link: s.link,
      wordCountEstimate: "N/A" // Requiere visitar cada link, opcional
    })),
    difficulty: calculateDifficulty(serp),
    intent: detectIntent(keyword, serp)
  };

  const fileName = `analysis-${keyword.replace(/\s+/g, '-')}.json`;
  const filePath = path.join(process.cwd(), 'docs', fileName);
  
  if (!fs.existsSync(path.join(process.cwd(), 'docs'))) {
    fs.mkdirSync(path.join(process.cwd(), 'docs'), { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(analysis, null, 2));

  console.log(`\n✅ Análisis completado.`);
  console.log(`📊 Sugerencias encontradas: ${suggestions.length}`);
  console.log(`🏆 Competidores analizados: ${serp.length}`);
  console.log(`🎯 Intención detectada: ${analysis.intent}`);
  console.log(`💪 Dificultad estimada: ${analysis.difficulty}/100`);
  console.log(`\n📂 Reporte guardado en: docs/${fileName}\n`);
}

function calculateDifficulty(serp: any[]): number {
  // Lógica simple: más resultados con títulos exactos = más difícil
  // También podríamos ver si hay dominios tipo .gov, .edu o grandes medios
  let score = 20; // Base
  if (serp.length >= 10) score += 30;
  
  const highAuthority = ['wikipedia', 'amazon', 'nytimes', 'mayoclinic', 'healthline'];
  serp.forEach(s => {
    if (highAuthority.some(domain => s.link.toLowerCase().includes(domain))) score += 5;
  });

  return Math.min(100, score);
}

function detectIntent(keyword: string, serp: any[]): string {
  const kw = keyword.toLowerCase();
  if (['comprar', 'precio', 'oferta', 'tienda'].some(w => kw.includes(w))) return "Transaccional";
  if (['mejor', 'vs', 'comparativa', 'review'].some(w => kw.includes(w))) return "Comercial";
  if (['que es', 'como', 'porque', 'guia', 'tutorial'].some(w => kw.includes(w))) return "Informacional";
  
  // Si no se detecta por keyword, ver títulos de SERP
  const titles = serp.map(s => s.title.toLowerCase()).join(' ');
  if (titles.includes('comprar') || titles.includes('carrito')) return "Transaccional";
  
  return "Informacional"; // Default
}
