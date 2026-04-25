import { parseMarkdownFile } from '../../parser';
import fs from 'fs';

export async function generateInstagramContent(filePath: string, url: string) {
  const article = parseMarkdownFile(filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract H2 headers for the carousel
  const h2Regex = /^## (.*$)/gm;
  const matches = [...content.matchAll(h2Regex)];
  const points = matches.map(m => m[1]);

  const caption = `
✨ ${article.title} ✨

¿Sientes que tu contenido no despega? A veces el secreto está en "${article.keyword}". 🚀

Desliza para ver los puntos clave que te ayudarán a optimizar tu estrategia hoy mismo. ➡️

En este post te explico:
📍 Por qué es importante dominar este nicho.
📍 Los errores que están frenando tu crecimiento.
📍 La hoja de ruta para ganar en Google.

¡Guarda este post para que no se te olvide! 📌
Link en la bio para leer el artículo completo: ${url} 🔗

.
.
.
#SEO #MarketingTips #ContentCreator #InstagramStrategy #ViralMarketing
`.trim();

  const carouselPlan = {
    title: article.title,
    slides: [
      { type: 'title', text: article.title, subtitle: `Dominando ${article.keyword}` },
      ...points.slice(0, 5).map((p, i) => ({
        type: 'point',
        number: i + 1,
        text: p
      })),
      { type: 'cta', text: 'Lee más en el blog', subtext: `URL: ${url}` }
    ]
  };

  return { caption, carouselPlan };
}
