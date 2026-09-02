# AGENTS.md — Reglas del repositorio

## Flujo de trabajo Git

1. **Nunca hacer push directo a `main`**.
2. Todo el trabajo se hace en la rama `dev`: commit y push a `dev`.
3. `main` solo se actualiza mediante **merge desde `dev`**
   (`git checkout main && git merge dev && git push`), cuando el trabajo está
   listo para publicar.

## Testing

- Cada funcionalidad nueva se implementa primero como fórmulas puras en
  `src/utils/formulas/` con tests unitarios, después la UI, después tests de
  integración (`npm test`).
- Objetivo de cobertura: ≥ 70%.

## Contenido clínico

- Toda calculadora muestra la fuente clínica de sus resultados (SETH, WFH,
  BSH, ASH/ISTH...).
- Las matrices de decisión viven en archivos de datos versionados, no
  incrustadas en componentes. Celdas sin evidencia clara devuelven
  "consultar especialista".
- El contenido clínico del `ROADMAP.md` es orientativo: requiere revisión del
  especialista antes de implementarse.
