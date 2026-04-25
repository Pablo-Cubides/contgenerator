import fs from 'fs';
import path from 'path';

export function generateAssemblyGuide(article: any, hooks: any[], ctas: any[], nblmVideoUrl: string | null, outputPath: string) {
  const guide = `
# 🎬 Guía de Ensamblaje de Video: ${article.title}

Este documento contiene las instrucciones para montar el video final uniendo los segmentos de ContGenerator y NotebookLM.

## 1. Estructura del Video (Timeline sugerido)

| Tiempo | Segmento | Fuente |
|:-------|:---------|:-------|
| 0:00 - 0:05 | **HOOK Viral** | Ver sección Hooks abajo |
| 0:05 - [Final] | **CUERPO (Científico)** | NotebookLM (Ref: ${nblmVideoUrl || 'Generando...'}) |
| [Final] - [+5s] | **CTA de Cierre** | Ver sección CTAs abajo |

---

## 2. Segmentos Disponibles

### Hooks (Elegir uno)
${hooks.map(h => `
#### Variante: ${h.variant} (${h.duration})
- 🎬 **Visual**: ${h.visual}
- 🎙️ **Audio**: "${h.audio}"
`).join('\n')}

---

### CTAs (Elegir uno según plataforma)
${ctas.map(c => `
#### Plataforma: ${c.platform}
- 🎬 **Visual**: ${c.visual}
- 🎙️ **Audio**: "${c.audio}"
`).join('\n')}

---

## 3. Instrucciones de Edición
1. **Grabar el Hook**: Usa una de las variantes de audio y sigue la instrucción visual.
2. **Insertar Cuerpo**: El video de NotebookLM proporciona la base técnica y detallada del artículo.
3. **Música**: Se recomienda una pista de fondo tipo "Lo-fi beats" o "Tech corporate" a volumen bajo (10-15%).
4. **Exportación**: Formato vertical (9:16) para TikTok/Reels/Shorts.

---
Generado por **ContGenerator Content Amplification Engine**.
`.trim();

  fs.writeFileSync(outputPath, guide);
}
