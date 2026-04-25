import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { calculateReadability } from '../seo/readability';

export function generateHeatmap(filePath: string) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`[Error] Archivo no encontrado: ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf8');
  const { data, content } = matter(fileContent);
  const keyword = (data.keyword || "").toString().toLowerCase();

  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  
  let htmlContent = paragraphs.map(p => {
    const read = calculateReadability(p);
    let bgColor = '#e8f5e9'; // Green (Easy)
    if (read.score < 60) bgColor = '#fff3e0'; // Orange (Medium)
    if (read.score < 40) bgColor = '#ffebee'; // Red (Hard)

    // Highlight keywords
    let highlightedText = p;
    if (keyword) {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = p.replace(regex, '<span style="background-color: yellow; font-weight: bold;">$1</span>');
    }

    return `
      <div style="background-color: ${bgColor}; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 5px solid ${read.score < 40 ? 'red' : (read.score < 60 ? 'orange' : 'green')}">
        <small style="color: #666;">Readability: ${read.score} (${read.level})</small>
        <p style="margin-top: 5px; line-height: 1.6;">${highlightedText}</p>
      </div>
    `;
  }).join('');

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>SEO Heatmap - ${data.title}</title>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; background: #f0f2f5; display: flex; justify-content: center; padding: 20px; }
        .mobile-shell { width: 375px; height: 812px; background: white; border: 12px solid #333; border-radius: 40px; overflow-y: auto; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); position: relative; }
        .mobile-shell::-webkit-scrollbar { width: 0; }
        h1 { font-size: 20px; margin-bottom: 20px; }
        .legend { position: fixed; left: 20px; top: 20px; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .legend-item { display: flex; align-items: center; margin-bottom: 5px; }
        .box { width: 15px; height: 15px; margin-right: 10px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="legend">
        <strong>Leyenda de Lectura</strong>
        <div class="legend-item"><div class="box" style="background: #e8f5e9;"></div> Fácil</div>
        <div class="legend-item"><div class="box" style="background: #fff3e0;"></div> Normal</div>
        <div class="legend-item"><div class="box" style="background: #ffebee;"></div> Difícil</div>
        <div class="legend-item" style="margin-top:10px;"><div class="box" style="background: yellow;"></div> Keyword</div>
    </div>

    <div class="mobile-shell">
        <div style="height: 5px; width: 40px; background: #ddd; margin: 0 auto 20px; border-radius: 10px;"></div>
        <h1>${data.title}</h1>
        ${htmlContent}
        <div style="height: 50px;"></div>
    </div>
</body>
</html>
  `;

  const reportPath = path.join(process.cwd(), 'docs', `heatmap-${path.basename(filePath, '.md')}.html`);
  if (!fs.existsSync(path.join(process.cwd(), 'docs'))) {
    fs.mkdirSync(path.join(process.cwd(), 'docs'), { recursive: true });
  }

  fs.writeFileSync(reportPath, htmlTemplate);
  console.log(`\n🔥 Heatmap visual generado: docs/heatmap-${path.basename(filePath, '.md')}.html`);
  console.log(`📱 Abre este archivo en tu navegador para ver la simulación móvil.\n`);
}
