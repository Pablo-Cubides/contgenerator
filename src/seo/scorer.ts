import { calculateReadability } from './readability';

export interface SeoScore {
  total: number;
  breakdown: {
    title: number;
    meta: number;
    keywordPlacement: number;
    headings: number;
    wordCount: number;
    density: number;
    lsi: number;
    internalLinks: number;
    readability: number;
    externalSources: number;
  };
  issues: string[];
  suggestions: string[];
}

export function scoreArticle(article: any): SeoScore {
  const { title, keyword, meta_description, content, wordCount, categorySlug, sources = [] } = article;
  const body = content.toLowerCase();
  const kw = keyword.toLowerCase();
  
  const issues: string[] = [];
  const suggestions: string[] = [];
  const breakdown = {
    title: 0,
    meta: 0,
    keywordPlacement: 0,
    headings: 0,
    wordCount: 0,
    density: 0,
    lsi: 0,
    internalLinks: 0,
    readability: 0,
    externalSources: 0
  };

  // 1. Title (15%)
  if (title.toLowerCase().includes(kw)) breakdown.title += 10;
  if (title.length <= 60) breakdown.title += 5;
  else issues.push("Título demasiado largo (> 60 caracteres)");

  // 2. Meta Description (10%)
  if (meta_description) {
    if (meta_description.toLowerCase().includes(kw)) breakdown.meta += 5;
    if (meta_description.length <= 160) breakdown.meta += 5;
    else issues.push("Meta descripción demasiado larga (> 160 caracteres)");
  } else {
    issues.push("Meta descripción ausente");
  }

  // 3. Keyword Placement (15%)
  const first100 = body.substring(0, 100);
  if (first100.includes(kw)) breakdown.keywordPlacement += 15;
  else suggestions.push("Incluye la keyword en los primeros 100 caracteres");

  // 4. Headings (15%)
  const h1Match = body.match(/^#\s+(.*)/m);
  if (h1Match && h1Match[1].includes(kw)) breakdown.headings += 10;
  const h2Count = (body.match(/^##\s+/gm) || []).length;
  if (h2Count >= 2) breakdown.headings += 5;
  else suggestions.push("Usa al menos dos subtítulos H2");

  // 5. Word Count (5%)
  if (wordCount >= 800) breakdown.wordCount = 5;
  else if (wordCount >= 500) breakdown.wordCount = 3;
  else issues.push("Contenido muy corto (< 500 palabras)");

  // 6. Density (5%)
  const kwCount = (body.match(new RegExp(kw, 'g')) || []).length;
  const density = (kwCount / wordCount) * 100;
  if (density >= 0.5 && density <= 2.5) breakdown.density = 5;
  else if (density > 2.5) issues.push(`Densidad de keyword alta (${density.toFixed(2)}%)`);
  else suggestions.push("Aumenta la densidad de la keyword principal");

  // 7. Internal Links (10%) - Detectado por presencia de markdown links [text](/slug)
  const linkMatches = body.match(/\[.*?\]\((\/.*?)\)/g) || [];
  if (linkMatches.length >= 1) breakdown.internalLinks = 10;
  else suggestions.push("Añade al menos un enlace interno");

  // 8. External Sources (10%) - E-E-A-T
  if (sources.length >= 2) breakdown.externalSources = 10;
  else if (sources.length === 1) breakdown.externalSources = 5;
  else issues.push("Faltan fuentes de autoridad (E-E-A-T)");

  // 8. Readability (15%)
  const read = calculateReadability(content);
  breakdown.readability = Math.round((read.score / 100) * 15);
  if (read.score < 50) issues.push(`Legibilidad baja (${read.score}): ${read.level}`);

  // 9. External Sources (E-E-A-T) (10%)
  const sources = article.sources || [];
  if (sources.length >= 2) breakdown.externalSources = 10;
  else if (sources.length === 1) breakdown.externalSources = 5;
  else issues.push("Faltan fuentes de autoridad (E-E-A-T)");

  // Calculate Total
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    total: Math.min(100, total),
    breakdown,
    issues,
    suggestions
  };
}
