import { parseMarkdownFile } from '../parser';

export async function generateCTAs(filePath: string) {
  const article = parseMarkdownFile(filePath);

  const ctas = [
    {
      platform: 'TikTok/Reels',
      audio: `Sígueme para más hacks de ${article.keyword} y guarda este video para después. Link en bio para la guía completa.`,
      visual: `Señalando al botón de seguir y al link en la bio.`
    },
    {
      platform: 'YouTube',
      audio: `Si te sirvió este video sobre ${article.keyword}, suscríbete y dale a la campanita. Nos vemos en el blog.`,
      visual: `Animación de botón de suscripción.`
    }
  ];

  return ctas;
}
