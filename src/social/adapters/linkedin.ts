import { parseMarkdownFile } from '../../parser';
import fs from 'fs';

export async function generateLinkedInPost(filePath: string, url: string) {
  const article = parseMarkdownFile(filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract H2 headers for the points
  const h2Regex = /^## (.*$)/gm;
  const matches = [...content.matchAll(h2Regex)];
  const points = matches.map(m => m[1]).slice(0, 5); // Max 5 points

  const post = `
🔥 ${article.title.toUpperCase()}

El SEO no es solo una cuestión de técnica, es una cuestión de estrategia y comprensión del usuario. Recientemente he estado analizando profundamente el impacto de "${article.keyword}" y he llegado a conclusiones fascinantes.

Aquí te comparto los 5 pilares fundamentales que extraje de mi último análisis:

${points.map((p, i) => `🔹 ${p}`).join('\n')}

Este análisis demuestra que para triunfar en el entorno digital actual, necesitamos herramientas que vayan más allá de lo básico.

📖 Lee el análisis completo aquí: ${url}

¿Cómo estás abordando tú la estrategia de ${article.keyword} en tu proyecto? Cuéntame en los comentarios. 👇

#SEO #DigitalMarketing #GrowthHacking #BusinessIntelligence
`.trim();

  return post;
}
