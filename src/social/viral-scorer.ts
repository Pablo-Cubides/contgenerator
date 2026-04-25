export interface SocialAuditResult {
  total: number;
  breakdown: {
    hook: number;
    formatting: number;
    platformFit: number;
    cta: number;
    keywords: number;
  };
  issues: string[];
  suggestions: string[];
}

export function scoreSocialContent(content: string, platform: 'twitter' | 'linkedin' | 'tiktok' | 'general' = 'general'): SocialAuditResult {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  const text = content.toLowerCase();
  
  const issues: string[] = [];
  const suggestions: string[] = [];
  const breakdown = {
    hook: 0,
    formatting: 0,
    platformFit: 0,
    cta: 0,
    keywords: 0
  };

  // 1. Hook Strength (30%) - First 2 lines
  const hookText = lines.slice(0, 2).join(' ').toLowerCase();
  const viralTriggers = ['?', 'cómo', 'por qué', 'secreto', 'error', 'guía', 'hilo', '🧵', '🔥', 'stop', 'atención'];
  if (viralTriggers.some(t => hookText.includes(t))) breakdown.hook = 30;
  else suggestions.push("Mejora el gancho inicial con una pregunta, un emoji llamativo o una promesa de valor.");

  // 2. Formatting (20%) - White space, emojis, lists
  const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  const listCount = (content.match(/^[-*•1-9]\.?\s/gm) || []).length;
  
  if (lines.length > 3 && content.includes('\n\n')) breakdown.formatting += 10;
  if (emojiCount >= 1 && emojiCount <= 5) breakdown.formatting += 5;
  if (listCount >= 2) breakdown.formatting += 5;
  else suggestions.push("Usa listas o espacios en blanco para que el texto sea más escaneable.");

  // 3. Platform Fit (20%)
  if (platform === 'twitter') {
    if (content.length <= 280) breakdown.platformFit = 20;
    else issues.push("El contenido excede los 280 caracteres de Twitter (a menos que sea un hilo).");
  } else if (platform === 'linkedin') {
    if (content.length >= 200) breakdown.platformFit = 20;
    else suggestions.push("Los posts de LinkedIn funcionan mejor con más de 200 caracteres.");
  } else {
    breakdown.platformFit = 20;
  }

  // 4. CTA Strength (20%)
  const ctaWords = ['comenta', 'sígueme', 'comparte', 'link', 'bio', 'clic', 'suscríbete', '👇', '🚀'];
  if (ctaWords.some(w => text.includes(w))) breakdown.cta = 20;
  else suggestions.push("Añade un llamado a la acción (CTA) claro al final.");

  // 5. Keywords/Hashtags (10%)
  const hashtags = (content.match(/#\w+/g) || []).length;
  if (hashtags >= 1 && hashtags <= 5) breakdown.keywords = 10;
  else if (hashtags > 5) issues.push("Demasiados hashtags pueden parecer spam.");
  else suggestions.push("Añade al menos 1 o 2 hashtags relevantes.");

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    total,
    breakdown,
    issues,
    suggestions
  };
}
