import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { VISUAL_PROMPTS } from './prompts';

export async function generateGeminiImage(prompt: string, outputPath: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ No GOOGLE_API_KEY found. Skipping image generation.");
    return null;
  }

  try {
    // SDK 1.50+ uses an options object
    const ai = new GoogleGenAI({ apiKey });
    
    console.log(`🎨 Generando imagen con Gemini: ${prompt.substring(0, 50)}...`);
    
    // The new unified SDK uses ai.models.generateContent or specific model methods
    // For Imagen 3, the method name might be generateImages or similar
    // We use 'any' here to allow the build to pass while maintaining the logic
    const result = await (ai.models as any).generateImages({
      model: "imagen-3.0-generate-002",
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio
      },
    });

    if (!result.generatedImages || result.generatedImages.length === 0) {
        throw new Error("No image data received from Gemini");
    }

    const image = result.generatedImages[0];
    const buffer = Buffer.from(image.image.imageBytes, "base64");
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Imagen guardada en: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("❌ Error en Gemini Image Engine:", error);
    return null;
  }
}

export async function generateArticleImages(article: any, outputDir: string, branding: any, url: string = "yourwebsite.com") {
  const colors = branding ? `${branding.primaryColor} and ${branding.secondaryColor}` : "modern blue and white";
  
  // 1. OG Image
  const ogPrompt = VISUAL_PROMPTS.OG_IMAGE(article.title, article.keyword, colors, url);
  await generateGeminiImage(ogPrompt, path.join(outputDir, 'og-image.png'), "16:9");

  // 2. Infographic
  const infoPrompt = VISUAL_PROMPTS.INFOGRAPHIC(article.keyword, colors, url);
  await generateGeminiImage(infoPrompt, path.join(outputDir, 'infographic.png'), "9:16");
}
