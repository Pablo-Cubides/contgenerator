import { parseMarkdownFile } from '../../parser';

export async function generateFacebookPost(filePath: string, url: string) {
  const article = parseMarkdownFile(filePath);

  const post = `
🤔 ¿Alguna vez te has preguntado cómo mejorar tu posicionamiento con "${article.keyword}"?

Acabo de publicar una guía súper completa sobre ${article.title}. En ella explico paso a paso cómo dominar este nicho y por qué es vital para tu estrategia de marketing este año.

Lo que aprenderás:
✅ Cómo optimizar el contenido para intención de búsqueda.
✅ Errores comunes que debes evitar.
✅ Estrategias prácticas para ver resultados reales.

Puedes leer el artículo completo aquí: ${url}

¡Espero que te sirva de mucho! Si tienes dudas, déjalas abajo. 👇✨

#MarketingDigital #Blog #SEO #Tips
`.trim();

  return post;
}
