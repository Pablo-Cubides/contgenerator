import { parseMarkdownFile } from '../../parser';

export async function generateTikTokScript(filePath: string, url: string) {
  const article = parseMarkdownFile(filePath);

  const script = `
# 📱 TIKTOK SCRIPT: ${article.title}

## 1. HOOK (0:00 - 0:03)
🎬 Visual: Texto en pantalla "¿Tu SEO está muerto?" + Cara de sorpresa.
🎙️ Audio: "Si estás escribiendo artículos y nadie los lee, probablemente es porque ignoras esto sobre ${article.keyword}."

## 2. DESARROLLO (0:03 - 0:45)
🎬 Visual: Pantallazo del artículo o lista de puntos apareciendo.
🎙️ Audio: "He descubierto que para rankear por ${article.keyword}, no basta con repetir la palabra. Tienes que entender la INTENCIÓN. Aquí te van los 3 puntos clave que debes optimizar ahora mismo."

## 3. PLOT TWIST (0:45 - 0:50)
🎬 Visual: Zoom a la cara, tono más serio.
🎙️ Audio: "Pero ojo, si cometes el error de sobre-optimizar, Google te va a penalizar antes de que puedas decir 'indexar'."

## 4. CTA (0:50 - 0:60)
🎬 Visual: Señalando al link en la bio / botón de seguir (Texto: ${url})
🎙️ Audio: "Te he dejado la guía completa con todos los pasos en mi blog. Link en la bio (${url}) y sígueme para más hacks de SEO viral."

# 🏷️ TAGS
#SEO #MarketingHacks #ViralTips #BlogStrategy
`.trim();

  return script;
}
