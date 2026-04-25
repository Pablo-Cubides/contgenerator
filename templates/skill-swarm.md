# Skill: Antigravity Content Swarm ⛓️

Esta skill convierte a Antigravity en un sistema autónomo de gestión de contenidos para el proyecto.

## Activación
Para iniciar la misión, escribe: `"Ejecuta la misión de gestión de contenidos"`

---

## 🤖 Fase 1: Modo Analista (Investigador)
**Objetivo:** Identificar tendencias y proponer temas sustentados.

1. **Investigación Web:** Usa tus herramientas para buscar tendencias recientes sobre el nicho del proyecto.
2. **NotebookLM Check:** Cruza las tendencias con el Notebook asociado (ID: `{{NOTEBOOK_ID}}`) usando `notebook_query`.
3. **Propuesta:** Crea un archivo llamado `docs/content-plan-[DATE].md` basándote en el template de `content-plan-template.md`.
4. **🛑 STOP:** Presenta las propuestas al usuario y espera aprobación explícita.

---

## 🤖 Fase 2: Modo Redactor (Creador)
**Objetivo:** Escribir artículos de alta calidad siguiendo el formato del parser.

Para cada artículo aprobado en el plan:
1. **Investigación Profunda:** Usa `notebook_query` para extraer datos específicos del NotebookLM.
2. **Redacción Estricta:** Escribe el artículo asegurando un conteo adecuado de palabras.
   - **Formato Requerido:**
     ```
     N. Título del Artículo
     Keyword Principal: keyword-aqui
     
     Introducción
     [Texto...]
     
     1. Subtítulo 1
     [Texto...]
     
     CTA – ¿Qué hacer ahora?
     [Texto CTA...]
     ```
3. **Inyección:** Añade el artículo al final del archivo `.txt` correspondiente en `{{CONTENT_DIR}}/`.

---

## 🤖 Fase 3: Modo Auditor y Publisher (Despliegue)
**Objetivo:** Validar, procesar y enviar a producción.

1. **Auditoría:** Verifica que los archivos tengan el formato correcto según lo especificado.
2. **Parsing:** Ejecuta el comando de generación: `npm run parse-content`.
3. **Validación Visual/Código:** Revisa que el código TypeScript o JSON generado sea válido.
4. **Deploy:** Coordina con el usuario el lanzamiento a producción de la plataforma destino.
5. **🛑 FINAL:** Confirma al usuario el éxito de la publicación.
