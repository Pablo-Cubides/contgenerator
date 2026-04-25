#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { buildContent } from './parser';
import { auditProject } from './commands/audit';
import { analyzeKeyword } from './commands/analyze';
import { generateGlobalReport } from './commands/report';
import { auditSocial } from './commands/social-audit';
import { auditCopy } from './commands/copy-audit';
import { generateHeatmap } from './commands/heatmap';
import { runAmplify } from './commands/amplify';
import { runPublish } from './commands/publish';
import { runPipeline } from './commands/pipeline';

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log("Usage: contgenerator <init|build|audit|analyze|report|social-audit|copy-audit|heatmap|amplify|publish|pipeline>");
  process.exit(1);
}

const projectRoot = process.cwd();

if (command === 'init') {
  console.log("[ContGenerator] Inicializando proyecto SEO-first...");
  
  // 1. Create config file
  const configPath = path.join(projectRoot, 'contgenerator.config.json');
  if (!fs.existsSync(configPath)) {
    const defaultConfig = {
      notebookId: "YOUR_NOTEBOOK_ID_HERE",
      contentDir: "public/blog",
      outputFile: "src/data/blog-articles.ts",
      categories: [
        {
          id: "example-category",
          name: "Example Category",
          images: ["img1.jpg", "img2.jpg"]
        }
      ]
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log("✅ Creado contgenerator.config.json");
  }

  // 2. Create directories
  const skillsDir = path.join(projectRoot, 'docs', 'skills');
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  const contentDir = path.join(projectRoot, 'public', 'blog', 'example-category');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Create example markdown
  const exampleMdPath = path.join(contentDir, 'hello-world.md');
  if (!fs.existsSync(exampleMdPath)) {
    const exampleMd = `---
title: "Hello World: El inicio del SEO"
keyword: "hello world seo"
meta_description: "Descubre cómo un simple hello world puede estar optimizado para motores de búsqueda utilizando ContGenerator."
volume: 1500
kd: 12
intent: "Informacional"
---
# Introducción

Este es tu primer artículo generado con ContGenerator. A partir de ahora, cada archivo será un \`.md\` con su respectivo Frontmatter para asegurar que el SEO técnico sea impecable.

## Subtítulo de ejemplo

Puedes utilizar Markdown estándar para el contenido.
`;
    fs.writeFileSync(exampleMdPath, exampleMd);
    console.log("✅ Creado ejemplo public/blog/example-category/hello-world.md");
  }

  // 3. Copy templates 
  const coreTemplatesDir = path.join(__dirname, '..', 'templates');
  
  if (fs.existsSync(coreTemplatesDir)) {
    const skillContent = fs.readFileSync(path.join(coreTemplatesDir, 'skill-swarm.md'), 'utf8')
                           .replace("{{NOTEBOOK_ID}}", "YOUR_NOTEBOOK_ID_HERE")
                           .replace("{{CONTENT_DIR}}", "public/blog");
    fs.writeFileSync(path.join(skillsDir, 'antigravity-content-swarm.md'), skillContent);
    console.log("✅ Creado docs/skills/antigravity-content-swarm.md");

    const planContent = fs.readFileSync(path.join(coreTemplatesDir, 'content-plan.md'), 'utf8');
    fs.writeFileSync(path.join(skillsDir, 'content-plan-template.md'), planContent);
    console.log("✅ Creado docs/skills/content-plan-template.md");
  }

  // 4. Update package.json if it exists
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!pkg.scripts) pkg.scripts = {};
      pkg.scripts['parse-content'] = "contgenerator build";
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
      console.log("✅ Añadido script 'parse-content' en package.json");
    } catch (e) {
      console.warn("⚠️ No se pudo actualizar package.json automáticamente");
    }
  }

  console.log("🎉 Inicialización completada. Configura tus categorías y comienza a redactar en Markdown.");

} else if (command === 'build') {
  const configPath = path.join(projectRoot, 'contgenerator.config.json');
  buildContent(configPath);
} else if (command === 'audit') {
  const configPath = path.join(projectRoot, 'contgenerator.config.json');
  auditProject(configPath);
} else if (command === 'analyze') {
  const keyword = args.slice(1).join(" ");
  if (!keyword) {
    console.error("[Error] Debes proporcionar una keyword: contgenerator analyze \"mi keyword\"");
    process.exit(1);
  }
  analyzeKeyword(keyword);
} else if (command === 'report') {
  const configPath = path.join(projectRoot, 'contgenerator.config.json');
  generateGlobalReport(configPath);
} else if (command === 'social-audit') {
  const filePath = args[1];
  if (!filePath) {
    console.error("[Error] Debes proporcionar la ruta al archivo social: contgenerator social-audit \"path/to/post.md\"");
    process.exit(1);
  }
  auditSocial(filePath);
} else if (command === 'copy-audit') {
  const filePath = args[1];
  if (!filePath) {
    console.error("[Error] Debes proporcionar la ruta al archivo de copy: contgenerator copy-audit \"path/to/copy.md\"");
    process.exit(1);
  }
  auditCopy(filePath);
} else if (command === 'heatmap') {
  const filePath = args[1];
  if (!filePath) {
    console.error("[Error] Debes proporcionar la ruta al archivo: contgenerator heatmap \"path/to/article.md\"");
    process.exit(1);
  }
  generateHeatmap(filePath);
} else if (command === 'amplify') {
  const filePath = args[1];
  if (!filePath) {
    console.error("[Error] Debes proporcionar la ruta al archivo: contgenerator amplify \"path/to/article.md\"");
    process.exit(1);
  }
  runAmplify(filePath);
} else if (command === 'publish') {
  // ... (previous logic)
  const packPath = args[1];
  const platforms = args.find(a => a.startsWith('--platforms='))?.split('=')[1];
  const schedule = args.includes('--schedule');
  
  if (!packPath) {
    console.error("[Error] Debes proporcionar la ruta al Media Pack: contgenerator publish \"media-pack/slug/\"");
    process.exit(1);
  }
  runPublish(packPath, { platforms, schedule });
} else if (command === 'pipeline') {
  const filePath = args[1];
  const publish = args.includes('--publish');
  const schedule = args.includes('--schedule');
  
  if (!filePath) {
    console.error("[Error] Debes proporcionar la ruta al artículo: contgenerator pipeline \"public/blog/.../file.md\"");
    process.exit(1);
  }
  runPipeline(filePath, { publish, schedule });
} else {
  console.log(`Unknown command: ${command}`);
  console.log("Usage: contgenerator <init|build|audit|analyze|report|social-audit|copy-audit|heatmap|amplify|publish|pipeline>");
}
