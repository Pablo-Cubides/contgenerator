import fs from 'fs';
import path from 'path';
import { scoreCopywriting } from '../copy/copy-scorer';

export function auditCopy(filePath: string) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`[Error] Archivo no encontrado: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  
  console.log(`\n✍️  Auditando Copywriting para: ${path.basename(filePath)}`);
  
  const result = scoreCopywriting(content);

  console.log(`\n🏆 CONVERSION SCORE: ${result.total}/100`);
  console.log(`📌 Framework Detectado: ${result.framework}`);
  
  console.log(`\n📊 Desglose:`);
  console.log(`   - Framework:     ${result.breakdown.frameworkCompliance}/30`);
  console.log(`   - Impacto Emoc.: ${result.breakdown.emotionalImpact}/20`);
  console.log(`   - Objeciones:    ${result.breakdown.objectionHandling}/20`);
  console.log(`   - Escasez:       ${result.breakdown.scarcity}/10`);
  console.log(`   - Claridad:      ${result.breakdown.clarity}/20`);

  if (result.powerWordsDetected.length > 0) {
    console.log(`\n💎 Palabras de Poder: [${result.powerWordsDetected.join(', ')}]`);
  }

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
