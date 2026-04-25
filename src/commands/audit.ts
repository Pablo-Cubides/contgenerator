import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { scoreArticle } from '../seo/scorer';

export function auditProject(configPath: string) {
  if (!fs.existsSync(configPath)) {
    console.error(`[Error] Configuración no encontrada en ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const contentDir = path.resolve(process.cwd(), config.contentDir || "content");

  if (!fs.existsSync(contentDir)) {
    console.error(`[Error] Directorio de contenido no encontrado: ${contentDir}`);
    process.exit(1);
  }

  console.log(`\n🔍 Iniciando Auditoría SEO en: ${contentDir}\n`);
  console.log(`┌────────────────────────────────────────┬───────┬─────────┬──────────┐`);
  console.log(`│ Artículo                               │ Score │ Palabras│ Issues   │`);
  console.log(`├────────────────────────────────────────┼───────┼─────────┼──────────┤`);

  const categories = fs.readdirSync(contentDir, { withFileTypes: true }).filter(i => i.isDirectory());
  let totalScore = 0;
  let count = 0;

  for (const cat of categories) {
    const catDir = path.join(contentDir, cat.name);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(catDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: body } = matter(content);
      
      const article = {
        ...data,
        content: body,
        wordCount: body.split(/\s+/).filter(w => w.length > 0).length,
        categorySlug: cat.name
      };

      const result = scoreArticle(article);
      totalScore += result.total;
      count++;

      const fileName = file.padEnd(38).substring(0, 38);
      const score = result.total.toString().padStart(5);
      const words = article.wordCount.toString().padStart(7);
      const issues = result.issues.length.toString().padStart(8);

      console.log(`│ ${fileName} │ ${score} │ ${words} │ ${issues} │`);
    }
  }

  console.log(`└────────────────────────────────────────┴───────┴─────────┴──────────┘`);
  
  if (count > 0) {
    console.log(`\n📈 Promedio SEO del Blog: ${Math.round(totalScore / count)}/100`);
    console.log(`✅ Auditoría completada para ${count} artículos.\n`);
  } else {
    console.log(`\n⚠️ No se encontraron artículos para auditar.\n`);
  }
}
