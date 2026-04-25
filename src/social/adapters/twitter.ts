import fs from 'fs';
import { parseMarkdownFile } from '../../parser';

export async function generateTwitterThread(filePath: string, url: string) {
  const article = parseMarkdownFile(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract H2 headers
  const h2Regex = /^## (.*$)/gm;
  const matches = [...content.matchAll(h2Regex)];
  const points = matches.map(m => m[1]);

  const thread: string[] = [];

  // Tweet 1: Hook
  const hook = `🚀 ${article.title}\n\n¿Sabías que la clave para dominar "${article.keyword}" está en los detalles? 🧵👇`;
  thread.push(hook);

  // Tweets 2 to N: Insights from H2s
  points.forEach((point, index) => {
    const tweet = `${index + 1}/ ${point}\n\nEste es un punto clave para entender mejor cómo funciona la estrategia de ${article.keyword}. #SEO #MarketingDigital`;
    thread.push(truncateTweet(tweet));
  });

  // Final Tweet: CTA
  const cta = `📖 Lee la guía completa sobre ${article.keyword} aquí:\n\n${url}\n\n¿Qué te parece esta estrategia? Te leo en los comentarios. 💬`;
  thread.push(truncateTweet(cta));

  return thread;
}

function truncateTweet(text: string, limit: number = 280): string {
  if (text.length <= limit) return text;
  return text.substring(0, limit - 3) + '...';
}
