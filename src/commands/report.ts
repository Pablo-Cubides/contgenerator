import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { scoreArticle } from '../seo/scorer';

export function generateGlobalReport(configPath: string) {
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

  const categories = fs.readdirSync(contentDir, { withFileTypes: true }).filter(i => i.isDirectory());
  
  let totalArticles = 0;
  let totalWords = 0;
  let totalScore = 0;
  const categoryStats: Record<string, { count: number, avgScore: number }> = {};
  const lowScoreArticles: string[] = [];
  const intentDistribution: Record<string, number> = {};

  for (const cat of categories) {
    const catDir = path.join(contentDir, cat.name);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));
    
    let catScoreSum = 0;
    categoryStats[cat.name] = { count: files.length, avgScore: 0 };

    for (const file of files) {
      const filePath = path.join(catDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: body } = matter(content);
      
      const words = body.split(/\s+/).filter(w => w.length > 0).length;
      const result = scoreArticle({ ...data, content: body, wordCount: words });

      totalArticles++;
      totalWords += words;
      totalScore += result.total;
      catScoreSum += result.total;

      const intent = (data.intent || 'Desconocido').toString();
      intentDistribution[intent] = (intentDistribution[intent] || 0) + 1;

      if (result.total < 70) {
        lowScoreArticles.push(`${cat.name}/${file} (${result.total}/100)`);
      }
    }

    if (files.length > 0) {
      categoryStats[cat.name].avgScore = Math.round(catScoreSum / files.length);
    }
  }

  console.log(`\n📊 REPORTES GLOBALES DEL BLOG\n`);
  console.log(`📈 Resumen General:`);
  console.log(`   - Total Artículos: ${totalArticles}`);
  console.log(`   - Palabras Totales: ${totalWords.toLocaleString()}`);
  console.log(`   - Score SEO Promedio: ${totalArticles > 0 ? Math.round(totalScore / totalArticles) : 0}/100`);
  console.log(`   - Palabras por Artículo (Avg): ${totalArticles > 0 ? Math.round(totalWords / totalArticles) : 0}\n`);

  console.log(`🗂️  Por Categoría:`);
  Object.entries(categoryStats).forEach(([name, stats]) => {
    console.log(`   - ${name.padEnd(20)}: ${stats.count} artículos (Avg Score: ${stats.avgScore})`);
  });

  console.log(`\n🎯 Intención de Búsqueda:`);
  Object.entries(intentDistribution).forEach(([intent, count]) => {
    console.log(`   - ${intent.padEnd(20)}: ${count} (${Math.round((count / totalArticles) * 100)}%)`);
  });

  if (lowScoreArticles.length > 0) {
    console.log(`\n⚠️  Artículos Críticos (Score < 70):`);
    lowScoreArticles.forEach(a => console.log(`   - ${a}`));
  }

  console.log(`\n✅ Reporte generado correctamente.\n`);
}
