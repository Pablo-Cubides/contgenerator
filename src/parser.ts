import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { scoreArticle } from './seo/scorer';
import { slugify, countWords, calculateReadTime } from './utils/helpers';

// Zod Schema para la validación SEO Estricta
const ArticleSchema = z.object({
  title: z.string().max(80, "El título SEO no debe exceder 80 caracteres"),
  keyword: z.string(),
  meta_description: z.string().max(160, "La meta descripción no debe exceder 160 caracteres").optional(),
  volume: z.number().optional(),
  kd: z.number().optional(),
  intent: z.string().optional(),
  image: z.string().optional(),
  sources: z.array(z.string().url()).optional()
});

type ArticleData = z.infer<typeof ArticleSchema>;

// Format Parsers
export function parseMarkdownFile(filePath: string, categoryName: string = "General", categorySlug: string = "general", configImages: string[] = [], indexCounter: { val: number } = { val: 0 }) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownBody } = matter(content);

  // Validate frontmatter
  let parsedData: ArticleData;
  try {
    parsedData = ArticleSchema.parse(data);
  } catch (error: any) {
    console.error(`[Error SEO Validation] Archivo: ${filePath}`);
    console.error(error.errors);
    process.exit(1);
  }

  const wordCount = countWords(markdownBody);

  // Generar excerpt
  const cleanText = markdownBody.replace(/#+.*\n/g, '').replace(/\n/g, ' ').trim();
  const excerpt = cleanText.substring(0, 200).trim() + "...";

  // Select image
  let image = parsedData.image;
  if (!image) {
    const images = configImages || [];
    image = images.length > 0 ? images[indexCounter.val++ % images.length] : "";
  }

  const article = {
    title: parsedData.title,
    slug: slugify(parsedData.title),
    keyword: parsedData.keyword,
    meta_description: parsedData.meta_description || excerpt,
    volume: parsedData.volume,
    kd: parsedData.kd,
    intent: parsedData.intent,
    content: markdownBody.trim(),
    excerpt,
    readTime: calculateReadTime(markdownBody),
    wordCount,
    category: categoryName,
    categorySlug,
    date: new Date().toISOString().split("T")[0],
    image,
    sources: parsedData.sources || []
  };

  // NEW: Calculate SEO Score and detect internal links
  const seoResult = scoreArticle(article);
  const internalLinks = (markdownBody.match(/\[.*?\]\((\/.*?)\)/g) || []).map(l => l.match(/\((.*?)\)/)?.[1]);

  return {
    ...article,
    seo_score: seoResult.total,
    internal_links: internalLinks
  };
}// Simplified parser for Social/Amplify
export function parseArticleMetadata(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  
  try {
    const parsedData = ArticleSchema.parse(data);
    return {
      title: parsedData.title,
      keyword: parsedData.keyword,
      meta_description: parsedData.meta_description
    };
  } catch (error: any) {
    console.error(`[Error SEO Validation] Archivo: ${filePath}`);
    process.exit(1);
  }
}


// Main execution function
export function buildContent(configPath: string) {
  console.log(`[ContGenerator] Iniciando compilación SEO-first usando: ${configPath}`);
  
  if (!fs.existsSync(configPath)) {
    console.error(`[Error] Archivo de configuración no encontrado en ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const contentDir = path.resolve(process.cwd(), config.contentDir || "content");
  const outputFile = path.resolve(process.cwd(), config.outputFile || "data.json");
  
  if (!fs.existsSync(contentDir)) {
    console.error(`[Error] Directorio de contenido no encontrado en ${contentDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.warn(`[Warning] No se encontraron archivos .md en ${contentDir}`);
  }

  let allArticles: any[] = [];
  const generatedCategories: any[] = [];
  const indexCounter = { val: 0 };

  // Agrupar archivos por carpeta/categoría si es necesario,
  // Para mantener compatibilidad con el diseño anterior, si el archivo es "categoria.md" 
  // podriamos considerarlo, o mejor: cada carpeta dentro de contentDir es una categoría
  // Pero el diseño anterior leía "file.replace('.txt', '')" como el slug de la categoría.
  // Vamos a adaptar para que lea archivos dentro de carpetas de categorías.

  // Para compatibilidad: Iterar sobre directorios dentro de contentDir
  const items = fs.readdirSync(contentDir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory()) {
      const slug = item.name;
      const categoryConfig = config.categories.find((c: any) => c.id === slug);
      
      if (!categoryConfig) {
        console.warn(`[Warning] No hay config para la categoría ${slug}. Saltando.`);
        continue;
      }

      const catDir = path.join(contentDir, item.name);
      const mdFiles = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));
      
      const articles = [];
      for (const mdFile of mdFiles) {
        const filePath = path.join(catDir, mdFile);
        const article = parseMarkdownFile(filePath, categoryConfig.name, slug, categoryConfig.images, indexCounter);
        articles.push(article);
      }

      allArticles = allArticles.concat(articles);
      generatedCategories.push({
        name: categoryConfig.name,
        slug: slug,
        count: articles.length
      });
    } else if (item.isFile() && item.name.endsWith('.md')) {
      // Legacy fallback: si los MD estan directo en contentDir
      const slug = item.name.replace('.md', '');
      const categoryConfig = config.categories.find((c: any) => c.id === slug);
      
      if (categoryConfig) {
         console.warn(`[Info] Parseando archivo MD como categoria: ${item.name}`);
         const filePath = path.join(contentDir, item.name);
         // Este caso asume que el MD tiene múltiples articulos adentro? No, el nuevo diseño es 1 MD = 1 Artículo.
         // Si está en la raiz, asumimos que es 1 articulo de la categoria "general"
      }
    }
  }

  // Generate output structure
  const outputData = {
    categories: generatedCategories,
    articles: allArticles
  };

  // Write output
  const outDir = path.dirname(outputFile);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  if (outputFile.endsWith('.ts')) {
    const tsContent = `// Auto-generated by ContGenerator\n\nexport const categories = ${JSON.stringify(outputData.categories, null, 2)};\n\nexport const articles = ${JSON.stringify(outputData.articles, null, 2)};\n`;
    fs.writeFileSync(outputFile, tsContent);
  } else {
    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  }

  console.log(`[Success] Se han validado y compilado ${allArticles.length} artículos en ${outputFile}`);
}
