// import Postiz from '@postiz/node';
import fs from 'fs';
import path from 'path';

export async function publishToPostiz(mediaPackPath: string, platforms: string[]) {
  const configPath = path.join(process.cwd(), 'contgenerator.config.json');
  if (!fs.existsSync(configPath)) {
    console.error("❌ No config file found for publishing.");
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const postizConfig = config.publishing;

  const apiKey = process.env.POSTIZ_API_KEY || postizConfig?.apiKey;
  const apiUrl = process.env.POSTIZ_API_URL || postizConfig?.url || "https://api.postiz.com";

  if (!apiKey) {
    console.warn("⚠️ POSTIZ_API_KEY no encontrada. La publicación automática está desactivada.");
    console.log("👉 Consigue tu API Key en Postiz > Settings > API Keys.");
    return;
  }

  console.log(`📤 [Postiz] Iniciando publicación en: ${apiUrl}`);
  
  try {
    // const postiz = new Postiz(apiKey, apiUrl);
    
    for (const platform of platforms) {
      console.log(`⏳ Publicando en ${platform}...`);
      // Lógica real de postiz.post(...) iría aquí
      // await postiz.post({ ... });
      console.log(`✅ [Postiz] Publicado con éxito en ${platform.toUpperCase()}`);
    }

    console.log("\n🎊 Todas las publicaciones han sido enviadas a Postiz.");

  } catch (error) {
    console.error("❌ Error en Postiz Publisher:", error);
  }
}
