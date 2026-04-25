# Skill: Antigravity Content Swarm ⛓️

Esta skill convierte a Antigravity en un sistema autónomo de gestión de contenidos SEO-first de nivel profesional.

## Activación
Para iniciar la misión, escribe: `"Ejecuta la misión de gestión de contenidos"`

---

## 🤖 Fase 1: Modo Analista (Investigador SEO)
**Objetivo:** Identificar tendencias y proponer temas sustentados con datos SEO reales.

1. **Investigación Profesional:** Utiliza el comando `npx contgenerator analyze "keyword"` para obtener datos de Google Autocomplete, Intención de Búsqueda y Dificultad basada en SERP (Scraping gratuito).
2. **NotebookLM Check:** Cruza las tendencias con el Notebook asociado (ID: `YOUR_NOTEBOOK_ID_HERE`) usando `notebook_query`.
3. **Análisis de Competencia:** Revisa los reportes JSON generados en `docs/analysis-*.json` para entender qué está posicionando y cómo superarlo.
4. **Propuesta:** Crea un archivo llamado `docs/content-plan-[DATE].md` basándote en el template de `content-plan-template.md`.
5. **🛑 STOP:** Presenta las propuestas al usuario y espera aprobación explícita.

---

## 🤖 Fase 2: Modo Redactor (Creador SEO)
**Objetivo:** Escribir artículos de alta calidad en formato Markdown con YAML Frontmatter, incluyendo semántica NLP/LSI.

Para cada artículo aprobado en el plan:
1. **Extracción LSI:** Genera una lista de 15 a 20 palabras clave secundarias (LSI/NLP) que deben estar presentes en el texto de forma natural.
2. **Redacción y Frontmatter:** Crea el archivo en el directorio correspondiente (`public/blog/[categoria]/slug-del-articulo.md`). 
3. **Validación Autónoma:** Asegúrate de que los metadatos cumplen estrictamente con las longitudes para que el Parser no falle.

---

## 🤖 Fase 3: Modo Auditor y Publisher (Despliegue)
**Objetivo:** Validar, puntuar y enviar a producción.

1. **Auditoría SEO Pro:** Ejecuta `npx contgenerator audit` para ver el score SEO (0-100) de todos los artículos. Si un artículo tiene menos de 80 puntos, corrígelo siguiendo los "Issues" reportados (ej. falta de keyword en H2, legibilidad baja).
2. **Interlinking:** Asegúrate de que existan enlaces internos (`[texto](/slug)`) detectados por el auditor para mejorar el PageRank interno.
3. **Parsing Final:** Ejecuta el comando de generación: `npm run parse-content` (que llama a `contgenerator build`).
4. **Validación de Errores (Zod):** Si el parser arroja un error de validación SEO (ej. un título muy largo), debes corregir el archivo `.md` automáticamente y volver a ejecutar el comando.
5. **🛑 FINAL:** Confirma al usuario el éxito de la publicación.
