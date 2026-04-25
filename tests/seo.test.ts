import { describe, it, expect } from 'vitest';
import { calculateReadability } from '../src/seo/readability';
import { scoreArticle } from '../src/seo/scorer';

describe('SEO Readability', () => {
  it('should calculate correct readability for simple text', () => {
    const text = "El gato es pequeño. El perro es grande. Me gusta el sol.";
    const result = calculateReadability(text);
    expect(result.score).toBeGreaterThan(50);
  });
});

describe('SEO Scorer', () => {
  it('should score high for a perfect article', () => {
    const perfectArticle = {
      title: "Cómo aprender SEO desde cero en 2024: Guía Completa",
      meta_description: "Aprender SEO paso a paso con esta guía definitiva. Todo sobre palabras clave, backlinks y optimización on-page para dominar Google en 2024.",
      keyword: "aprender SEO",
      content: "# Cómo aprender SEO\n\nAprender SEO es fundamental. El SEO es fundamental. Aprender SEO requiere tiempo.\n\n## Importancia del SEO\nGoogle ama el contenido de calidad.\n\n## Otro subtítulo H2\nContenido extra.",
      wordCount: 1200,
      image: "image.jpg"
    };

    const result = scoreArticle(perfectArticle as any);
    expect(result.total).toBeGreaterThan(70); 
  });

  it('should penalize short content', () => {
    const thinContent = {
      title: "SEO",
      keyword: "seo",
      content: "SEO es bueno.",
      wordCount: 3,
    };

    const result = scoreArticle(thinContent as any);
    expect(result.total).toBeLessThan(50);
  });
});
