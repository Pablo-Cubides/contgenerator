#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { buildContent } = require('../src/parser');

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log("Usage: contgenerator <init|build>");
  process.exit(1);
}

const projectRoot = process.cwd();

if (command === 'init') {
  console.log("[ContGenerator] Initializing project...");
  
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
    console.log("✅ Created contgenerator.config.json");
  }

  // 2. Create docs/skills directory
  const skillsDir = path.join(projectRoot, 'docs', 'skills');
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  // 3. Copy templates manually since this is a CLI
  const coreTemplatesDir = path.join(__dirname, '..', 'templates');
  
  if (fs.existsSync(coreTemplatesDir)) {
    const skillContent = fs.readFileSync(path.join(coreTemplatesDir, 'skill-swarm.md'), 'utf8')
                           .replace("{{NOTEBOOK_ID}}", "YOUR_NOTEBOOK_ID_HERE")
                           .replace("{{CONTENT_DIR}}", "public/blog");
    fs.writeFileSync(path.join(skillsDir, 'antigravity-content-swarm.md'), skillContent);
    console.log("✅ Created docs/skills/antigravity-content-swarm.md");

    const planContent = fs.readFileSync(path.join(coreTemplatesDir, 'content-plan.md'), 'utf8');
    fs.writeFileSync(path.join(skillsDir, 'content-plan-template.md'), planContent);
    console.log("✅ Created docs/skills/content-plan-template.md");
  }

  // 4. Update package.json if it exists
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!pkg.scripts) pkg.scripts = {};
      pkg.scripts['parse-content'] = "contgenerator build";
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
      console.log("✅ Added 'parse-content' script to package.json");
    } catch (e) {
      console.warn("⚠️ Could not update package.json automatically");
    }
  }

  console.log("🎉 Initialization complete. Please update contgenerator.config.json with real values.");

} else if (command === 'build') {
  const configPath = path.join(projectRoot, 'contgenerator.config.json');
  buildContent(configPath);
} else {
  console.log(`Unknown command: ${command}`);
  console.log("Usage: contgenerator <init|build>");
}
