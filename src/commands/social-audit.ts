import fs from 'fs';
import path from 'path';
import { scoreSocialContent } from '../social/viral-scorer';

export function auditSocial(filePath: string) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`[Error] Archivo no encontrado: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  
  // Detect platform based on filename or content tags
  let platform: any = 'general';
  if (filePath.toLowerCase().includes('twitter')) platform = 'twitter';
  if (filePath.toLowerCase().includes('linkedin')) platform = 'linkedin';

  console.log(`\n📱 Auditando contenido social para: ${path.basename(filePath)} [${platform}]`);
  
  const result = scoreSocialContent(content, platform);

  console.log(`\n🏆 VIRAL SCORE: ${result.total}/100`);
  
  console.log(`\n📊 Desglose:`);
  console.log(`   - Hook/Gancho: ${result.breakdown.hook}/30`);
  console.log(`   - Formato:      ${result.breakdown.formatting}/20`);
  console.log(`   - Plataforma:  ${result.breakdown.platformFit}/20`);
  console.log(`   - CTA:         ${result.breakdown.cta}/20`);
  console.log(`   - Tags/KWs:    ${result.breakdown.keywords}/10`);

  if (result.issues.length > 0) {
    console.log(`\n❌ Problemas:`);
    result.issues.forEach(i => console.log(`   - ${i}`));
  }

  if (result.suggestions.length > 0) {
    console.log(`\n💡 Sugerencias:`);
    result.suggestions.forEach(s => console.log(`   - ${s}`));
  }

  console.log('\n');
}
