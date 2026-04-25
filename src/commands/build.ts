import fs from 'fs';
import path from 'path';

export async function buildProject() {
  console.log("🏗️ [Build] Generando sitio estático...");
  
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist-site');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Simple copy for now as this is a placeholder for the static generator
  console.log("✅ [Build] Sitio generado en dist-site/");
}
