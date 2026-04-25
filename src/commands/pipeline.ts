import { auditProject } from './audit';
import { analyzeKeyword } from './analyze';
import { buildProject } from './build';
import { runAmplify } from './amplify';
import { runPublish } from './publish';
import { parseMarkdownFile } from '../parser';
import path from 'path';

export async function runPipeline(filePath: string, options: { publish?: boolean, schedule?: boolean }) {
  console.log(`🎬 [Pipeline] Iniciando flujo maestro para: ${filePath}`);
  
  try {
    const article = parseMarkdownFile(filePath);
    const configPath = path.join(process.cwd(), 'contgenerator.config.json');

    // 1. Auditoría SEO
    console.log("\n1️⃣  Fase: Auditoría SEO");
    await auditProject(configPath);

    // 2. Análisis Semántico de la Keyword
    console.log("\n2️⃣  Fase: Análisis Semántico");
    await analyzeKeyword(article.keyword || article.title);

    // 3. Build del Sitio
    console.log("\n3️⃣  Fase: Build Estático");
    await buildProject();

    // 4. Amplificación (Social + Visual + Video)
    console.log("\n4️⃣  Fase: Amplificación");
    await runAmplify(filePath);

    // 5. Publicación (Opcional)
    if (options.publish) {
      console.log("\n5️⃣  Fase: Publicación");
      const slug = path.basename(filePath, '.md');
      const packPath = path.join('media-pack', slug);
      await runPublish(packPath, { schedule: options.schedule });
    }

    console.log("\n🏆 [Pipeline] Flujo completado con éxito.");
  } catch (error) {
    console.error("❌ [Pipeline] Error crítico en el flujo:", error);
  }
}
