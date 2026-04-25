import fs from 'fs';
import path from 'path';
import { amplifyContent } from '../social';
import { parseMarkdownFile } from '../parser';
import { generateArticleImagesOpenAI } from '../visual/openai-engine';
import { generateHooks } from '../video/hook-generator';
import { generateCTAs } from '../video/cta-generator';
import { generateAssemblyGuide } from '../video/assembly-guide';
import { requestNotebookLMVideo } from '../video/nblm-bridge';

export async function runAmplify(filePath: string) {
  try {
    const article = parseMarkdownFile(filePath);
    const slug = path.basename(filePath, '.md');
    const mediaPackDir = path.join(process.cwd(), 'media-pack', slug);
    const socialDir = path.join(mediaPackDir, 'social');
    const imagesDir = path.join(mediaPackDir, 'images');
    const videoDir = path.join(mediaPackDir, 'video');

    if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    console.log(`🚀 Amplificando contenido: ${article.title}...`);
    
    // 1. Social Content
    const configPath = path.join(process.cwd(), 'contgenerator.config.json');
    const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
    const baseUrl = config.baseUrl || "https://yourwebsite.com";
    const articleUrl = `${baseUrl}/blog/${article.categorySlug}/${article.slug}`;

    const pack = await amplifyContent(filePath, articleUrl);
    fs.writeFileSync(path.join(socialDir, 'twitter.md'), pack.twitter.join('\n\n---\n\n'));
    fs.writeFileSync(path.join(socialDir, 'linkedin.md'), pack.linkedin);
    fs.writeFileSync(path.join(socialDir, 'facebook.md'), pack.facebook);
    fs.writeFileSync(path.join(socialDir, 'instagram.md'), `CAPTION:\n\n${pack.instagram.caption}\n\nCAROUSEL PLAN:\n\n${JSON.stringify(pack.instagram.carouselPlan, null, 2)}`);
    fs.writeFileSync(path.join(socialDir, 'tiktok.md'), pack.tiktok);

    // 2. Visual Content (OpenAI)
    let branding = config.branding || null;
    
    // 3. Video Pipeline (NBLM + Hooks)
    const hooks = await generateHooks(filePath);
    const ctas = await generateCTAs(filePath);
    
    let nblmVideoUrl = null;
    if (config.notebookId) {
      await requestNotebookLMVideo(config.notebookId, article.title, path.join(videoDir, 'nblm-request.json'));
    }

    generateAssemblyGuide(article, hooks, ctas, nblmVideoUrl, path.join(videoDir, 'assembly-guide.md'));

    await generateArticleImagesOpenAI(article, imagesDir, branding, articleUrl);

    console.log(`✅ Media Pack completo generado en: ${mediaPackDir}`);
  } catch (error) {
    console.error(`❌ Error al amplificar el contenido:`, error);
  }
}
