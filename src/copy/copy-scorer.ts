export interface CopyAuditResult {
  total: number;
  framework: 'AIDA' | 'PAS' | 'Desconocido';
  breakdown: {
    frameworkCompliance: number;
    emotionalImpact: number;
    objectionHandling: number;
    scarcity: number;
    clarity: number;
  };
  powerWordsDetected: string[];
  issues: string[];
  suggestions: string[];
}

export function scoreCopywriting(content: string): CopyAuditResult {
  const text = content.toLowerCase();
  const issues: string[] = [];
  const suggestions: string[] = [];
  const breakdown = {
    frameworkCompliance: 0,
    emotionalImpact: 0,
    objectionHandling: 0,
    scarcity: 0,
    clarity: 0
  };

  // 1. Framework Detection & Compliance (30%)
  const aidaIndicators = ['atención', 'interés', 'deseo', 'acción', 'mira', 'imagina', 'quieres'];
  const pasIndicators = ['problema', 'agita', 'solución', 'cansado', 'harto', 'imagina', 'finalmente'];
  
  const aidaScore = aidaIndicators.filter(i => text.includes(i)).length;
  const pasScore = pasIndicators.filter(i => text.includes(i)).length;

  let framework: 'AIDA' | 'PAS' | 'Desconocido' = 'Desconocido';
  if (aidaScore > pasScore && aidaScore >= 2) {
    framework = 'AIDA';
    breakdown.frameworkCompliance = 30;
  } else if (pasScore >= 2) {
    framework = 'PAS';
    breakdown.frameworkCompliance = 30;
  } else {
    suggestions.push("Estructura tu copia usando un framework claro como AIDA (Atención, Interés, Deseo, Acción) o PAS (Problema, Agitación, Solución).");
  }

  // 2. Emotional Impact & Power Words (20%)
  const powerWords = ['gratis', 'ahora', 'garantizado', 'secreto', 'nuevo', 'limitado', 'exclusivo', 'fácil', 'rápido', 'ahorra', 'gana', 'peligro', 'evita'];
  const detectedPowerWords = powerWords.filter(w => text.includes(w));
  if (detectedPowerWords.length >= 3) breakdown.emotionalImpact = 20;
  else suggestions.push("Usa más 'palabras de poder' (ej: gratis, exclusivo, garantizado) para aumentar el impacto emocional.");

  // 3. Objection Handling (20%)
  const objectionWords = ['pero', 'sin embargo', 'aunque', 'no te preocupes', 'garantía', 'devolución', 'seguro', 'riesgo'];
  if (objectionWords.some(w => text.includes(w))) breakdown.objectionHandling = 20;
  else suggestions.push("Anticipa y resuelve objeciones comunes del cliente (ej: garantías, seguridad).");

  // 4. Scarcity & Urgency (10%)
  const scarcityWords = ['solo hoy', 'quedan', 'limitado', 'vence', 'última oportunidad', 'termina', 'reloj', 'instante'];
  if (scarcityWords.some(w => text.includes(w))) breakdown.scarcity = 10;
  else suggestions.push("Añade un elemento de escasez o urgencia para incentivar la acción inmediata.");

  // 5. Clarity & Simplicity (20%)
  const avgWordLength = content.length / (content.split(' ').length || 1);
  if (avgWordLength < 6) breakdown.clarity = 20; // Short words = simple language
  else suggestions.push("Usa un lenguaje más sencillo y directo. Evita palabras técnicas innecesarias.");

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    total,
    framework,
    breakdown,
    powerWordsDetected: detectedPowerWords,
    issues,
    suggestions
  };
}
