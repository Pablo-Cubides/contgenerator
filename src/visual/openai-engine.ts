import OpenAI from "openai";
import fs from 'fs';
import path from 'path';
import { VISUAL_PROMPTS } from './prompts';

export async function generateOpenAIImage(prompt: string, outputPath: string, options: { size?: string, quality?: "standard" | "hd" } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ No OPENAI_API_KEY found. Skipping image generation.");
    return null;
  }

  try {
    const openai = new OpenAI({ apiKey });

    console.log(`🎨 Generando imagen con OpenAI (DALL-E 3): ${prompt.substring(0, 50)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: (options.size as any) || "1024x1024",
      quality: options.quality || "standard",
      response_format: "b64_json"
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No image data received from OpenAI");
    }

    const b64Data = response.data[0].b64_json;
    if (!b64Data) throw new Error("No image data received from OpenAI");

    const buffer = Buffer.from(b64Data, "base64");
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Imagen guardada en: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("❌ Error en OpenAI Image Engine:", error);
    return null;
  }
}

export async function generateArticleImagesOpenAI(article: any, outputDir: string, branding: any, url: string = "yourwebsite.com") {
  const colors = branding ? `${branding.primaryColor} and ${branding.secondaryColor}` : "modern blue and white";
  
  // 1. OG Image (16:9 -> DALL-E uses 1792x1024)
  const ogPrompt = VISUAL_PROMPTS.OG_IMAGE(article.title, article.keyword, colors, url);
  await generateOpenAIImage(ogPrompt, path.join(outputDir, 'og-image.png'), { size: "1792x1024" });

  // 2. Infographic
  const infoPrompt = VISUAL_PROMPTS.INFOGRAPHIC(article.keyword, colors, url);
  await generateOpenAIImage(infoPrompt, path.join(outputDir, 'infographic.png'), { size: "1024x1792" });
}
