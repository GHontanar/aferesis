# Roadmap — Calculadora de Aféresis v3.x

> Documento de planificación. Fecha: septiembre 2026.
> Estado de partida: app estable (v2.0.0), 8 calculadoras, 120 tests en verde.

---

## Contexto

La app es una suite de calculadoras para hematología (aféresis, banco de sangre,
medicina transfusional). Este roadmap define la siguiente generación de
funcionalidades, priorizadas por **utilidad clínica diaria × esfuerzo de
implementación**.

### Calculadoras existentes

| Calculadora | Archivo base |
|---|---|
| Intercambio plasmático (TPE) | `tpeCalculations.js` |
| Eritroaféresis (RCE) | `rceCalculations.js` |
| Linfoaféresis | `LinfoaferesisCalculator.jsx` |
| CD34 | `cd34Calculations.js` |
| Criopreservación (+ wizard crio) | `cryopreservationCalculations.js` |
| Citrato | `citrateCalculations.js` |
| DLI | `dliCalculations.js` |

### Principios del proyecto

1. **Fuente clínica visible**: cada resultado indica la guía o referencia que lo
   respalda (SETH, ESC, EHRA, ACCP...). El hematólogo siempre preguntará "¿de
   dónde sale esto?".
2. **Herramienta adyuvante**: las calculadoras informan decisiones, no las
   toman. Disclaimer visible donde la evidencia está discutida.
3. **Tests desde el inicio**: cada funcionalidad se implementa primero como
   fórmulas puras (`src/utils/formulas/`) con tests unitarios de tabla de
   casos, después la UI, después tests de integración. Objetivo de cobertura
   ≥ 70%.
4. **Arquitectura por dominio**: una carpeta por funcionalidad
   (formulas + componente + tests), siguiendo la estructura existente.
5. **Contenido clínico validado**: las tablas y fórmulas de este roadmap son
   orientativas. Cada fase requiere revisión del contenido clínico por el
   especialista antes de publicarse.
6. **Decisiones como datos**: las matrices de decisión (diagnóstico ×
   escenario) viven en archivos de datos versionados y con su fuente citada,
   nunca incrustadas en componentes. Celdas sin evidencia clara devuelven
   "consultar especialista", no una recomendación forzada.

---

## Fase 1 — Calculadora de protamina `Tamaño: S`

**Objetivo**: revertir anticoagulación de HNF y HBPM con dosificación segura
por dosis administrada y tiempo transcurrido.

**Contenido clínico**
- **HNF**: mg de protamina por 100 UI de heparina, con factor de reducción
  temporal (dosis completa < 30 min; reducción progresiva a 30–60, 60–120 y
  > 120 min). Máximo 50 mg por dosis, administración lenta IV.
- **HBPM (enoxaparina)**: 1 mg de protamina por 1 mg de enoxaparina si
  < 8 h; 0,5 mg/mg entre 8–12 h; sin reversión completa si > 12 h.
- Aviso explícito: danaparina y fondaparinux **no** tienen antídoto.

**Entradas**: fármaco, última dosis (UI o mg), tiempo desde la última dosis,
peso (opcional para HBPM).

**Criterios de aceptación**
- [ ] Resultado con dosis de protamina + advertencia de administración.
- [ ] Bordes temporales cubiertos en tests (30/60/120 min exactos).
- [ ] Validación: dosis > 0, tiempo ≥ 0.

**Tests**: unitarios de tabla (cada tramo temporal); caso de error con dosis
inválida.

---

## Fase 2 — Dosis pediátricas de hematíes y plaquetas `Tamaño: S`

**Objetivo**: dosificación transfusional segura en pediatría por peso.

**Contenido clínico**
- **Concentrado de hematíes**: dosis estándar 10–15 mL/kg (elevación esperada
  de Hb ~2–3 g/dL) y modo por objetivo (mL/kg necesarios para Hb deseada).
- **Plaquetas**: dosis por mL/kg y por unidades (1 unidad por cada ~10 kg),
  con incremento esperado de recuento.
- Límite de volumen máximo admisible por transfusión según peso.
- Diferenciación por franja de edad: neonato / lactante / niño (volumen
  sanguíneo distinto por kg).

**Entradas**: peso, edad (o franja), Hb actual y objetivo / recuento de
plaquetas actual y objetivo.

**Criterios de aceptación**
- [ ] Dos modos: dosis estándar y por objetivo.
- [ ] Aviso visual destacado en dosis que superen el volumen máximo.
- [ ] Validación de rangos plausibles de peso (0,5–150 kg).

**Tests**: unitarios por franja de peso; errores con peso fuera de rango.

---

## Fase 3 — Módulo de anticoagulación (suite con tabs) `Tamaño: M`

**Objetivo**: agrupar en un solo módulo con tabs las consultas de
anticoagulación más frecuentes.

### 3a. Planificador de cambio de anticoagulante

- AVK → ACOD: inicio según umbral de INR por fármaco (apixabán, rivaroxabán,
  dabigatrán, edoxabán).
- ACOD → AVK: solapamiento hasta INR terapéutico.
- HBPM ↔ ACOD: omitir dosis al iniciar ACOD (según CrCl).
- Parenteral → AVK: solapamiento mínimo de días.

**Entradas**: fármaco actual y destino, CrCl, indicación.

### 3b. Planificador perioperatorio (AVK, ACOD y HBPM)

Matriz de decisión: **riesgo hemorrágico del procedimiento × riesgo trombótico
del paciente × fármaco × función renal**.

- Tiempo de suspensión previa por fármaco (con ajuste por CrCl para ACOD,
  especialmente dabigatrán).
- AVK: días de suspensión y objetivo de INR pre-operatorio; puente con HBPM
  según riesgo trombótico.
- HBPM: última dosis profiláctica/terapéutica antes del procedimiento.
- Reincio post-operatorio por tipo de procedimiento.

**Entradas**: fármaco y dosis, CrCl (o edad/peso/creatinina para calcularlo
con Cockcroft-Gault), procedimiento (catálogo con riesgo hemorrágico),
riesgo trombótico (CHADS-VASc, válvula mecánica, TVP/TEP previa).

### 3c. Calculadora básica de anticoagulación

- CrCl (Cockcroft-Gault y CKD-EPI).
- Escalas de riesgo hemorrágico/trombótico: HAS-BLED y CHA₂DS₂-VASc.
- Referencia rápida de dosis de ACOD por indicación y ajuste renal.

**Criterios de aceptación**
- [ ] Cada resultado indica la guía de origen (SETH / ESC / EHRA / ACCP).
- [ ] CrCl calculado, no introducido a mano (si hay datos).
- [ ] El contenido de la matriz perioperatoria es editable en un solo archivo
  de datos (no incrustado en componentes) para facilitar actualizaciones.

**Tests**: unitarios de las tablas de decisión (casos por celda de la matriz);
errores con combinaciones sin recomendación disponible.

**Nota**: la carga de trabajo principal aquí es la **curación del contenido
clínico**, no el código. Reservar sesión de revisión con especialista.

---

## Fase 4 — Hemostasia: decisor y dosificación de agentes `Tamaño: M`

**Objetivo**: no solo calcular dosis, sino **recomendar el agente hemostático**
(factor, antifibrinolítico, DDAVP, ambos o ninguno) según diagnóstico, escenario
de sangrado y riesgo hemorrágico, y a continuación calcular la dosis y el
redondeo a viales.

**Arquitectura común a las tres piezas**
- Motor de decisión basado en reglas almacenadas como **datos** (matriz
  diagnóstico × escenario × severidad → recomendación + fuente), según el
  principio 6. Misma convención que la matriz perioperatoria de la Fase 3.
- Módulo de **ácido tranexámico (TXA)** reutilizable por todas las piezas:
  10–15 mg/kg IV q8h (o 1 g q8h), oral 25 mg/kg q6–8h, ajuste renal.
  Guardas de contraindicación: hematuria macroscópica con riesgo de coágulos
  obstructivos; aviso de cautela trombótica al combinar con agentes bypass.
- Cada recomendación muestra su fuente (BSH, WFH, ASH/ISTH, UKHCDO...) como
  el resto de la app.

### 4a. Factor IX y FVIIa (eptacog alfa / nonacog)

- **FIX (hemofilia B)**: dosis = peso × (objetivo % − nivel basal %) × factor
  de recuperación (≈ 1,0 en adultos; ≈ 1,2 en < 12–15 años). Objetivos
  indicativos: sangrado menor ~30–50 %, mayor ~50–80 %, cirugía 80–100 %.
  Frecuencia según semivida del producto (SHL ~18–24 h; EHL distinta):
  incluir selector de producto.
- **rFVIIa**: déficit de FVII (15–30 µg/kg por dosis); inhibidores y
  tromboastenia de Glanzmann (90 µg/kg q2–3 h; opción de dosis única
  270 µg/kg en sangrado menor). Mencionar FEIBA como alternativa y su
  interacción/cautela con TXA.
- **Redondeo a viales**: tamaños comerciales de FVIIa (1/2/5/8 mg) y FIX
  (250–3000 UI), con cálculo de desperdicio por dosis.

**Entradas**: fármaco/producto, peso, nivel basal, nivel objetivo, escenario
(sangrado menor/mayor, cirugía, profilaxis).

### 4b. Enfermedad de von Willebrand y desmopresina

**Decisor**: DDAVP vs concentrado de VWF según tipo:
- Tipo 1 → responde a desmopresina (confirmar con test de respuesta si se
  dispone).
- 2A / 2M → respuesta variable → test recomendado.
- 2N → respuesta parcial y transitoria del FVIII.
- 2B → **contraindicada** (agrava la trombocitopenia) → concentrado.
- Tipo 3 → sin respuesta → concentrado de VWF.

**Desmopresina**: 0,3 µg/kg IV/SC (máx 20 µg por dosis) o intranasal
(150 µg/espray: 1 espray < 50 kg, 2 si ≥ 50 kg). Advertencias incluidas en la
respuesta: restricción hídrica e hiponatremia (máxima cautela < 2 años),
taquifilaxia tras 2–3 días.

**Concentrado de VWF**: 40–60 UI/kg (productos con FVIII incluido). Objetivos
indicativos: cirugía mayor FVIII:C y VWF:RCo > 80–100 UI/dL y luego > 50
durante 7–14 días; cirugía menor > 50 durante 3–5 días; parto/posparto
> 50 durante 3–5 días.

**Entradas**: tipo de VWD (o niveles VWF:RCo/FVIII:C), peso, escenario
(sangrado / cirugía / parto), respuesta conocida a DDAVP (opcional).

### 4c. Coagulopatías raras (guía BSH)

Curado desde la guía BSH de trastornos coagulativos heredados raros
(*Investigation and management of the rare inherited coagulation disorders*).
Por cada trastorno: agente disponible, dosis, nivel objetivo, frecuencia y
semivida — todo como datos, no código.

| Trastorno | Agente habitual (BSH) | Notas |
|---|---|---|
| Afibrinogenemia / hipofibrinogenemia | Concentrado de fibrinógeno (crio si no disponible) | Objetivo ~1 g/L; dosis en función de nivel basal y peso |
| Disfibrinogenemia | Individualizada | Casos con especialista |
| Déficit de FII (protrombina) | CCP | Objetivo ~20–30 % |
| Déficit de FV | PFC (sin concentrado específico) | Vigilar volumen; objetivo ~15–20 % |
| Déficit combinado FV+FVIII | FVIII concentrado + PFC | FV solo vía plasma |
| Déficit de FVII | rFVIIa | Solapa con 4a |
| Déficit de FX | Concentrado de FX (o CCP) | Objetivo ~20–30 % |
| Déficit de FXI | Concentrado de FXI (o plasma) | Objetivo ~30–50 % según procedimiento; antecedentes de inhibidor |
| Déficit de FXIII | Concentrado de FXIII | Profilaxis 10–20 UI/kg q4–6 semanas |

El decisor incluye también α2-antiplasmin y PAI-1 (tratamiento
antifibrinolítico) como diagnóstico en la matriz.

**Entradas**: trastorno, nivel actual (si se conoce), peso, escenario
(sangrado menor/mayor, cirugía, profilaxis).

**Criterios de aceptación (fase completa)**
- [ ] El decisor nunca contradice sus guardas (DDAVP en tipo 2B, TXA + FEIBA
  sin aviso...). Guardas como casos de test dedicados.
- [ ] Toda celda de la matriz tiene fuente citada; celdas sin evidencia clara
  muestran "consultar especialista".
- [ ] Dosificación con redondeo a viales y cálculo de desperdicio.
- [ ] TXA y DDAVP reutilizables por las tres piezas y por fases futuras.

**Tests**: matriz completa por celda (diagnóstico × escenario), incluidas las
celdas sin recomendación; fórmulas de dosis con casos límite (peso pediátrico,
nivel basal 0); validación de redondeo a viales.

**Nota clínica**: los rangos anteriores son indicativos y deben curarse contra
la guía BSH y las de WFH / ASH-ISTH antes de implementar. Sesión de revisión
con especialista obligatoria: es la fase de mayor densidad clínica del roadmap.

---

## Fase 5 — Modo transfusión masiva `Tamaño: L`

**Objetivo**: asistente de sesión en tiempo real para protocolo de hemorragia
masiva: registro de lo administrado, recordatorios guiados y reporte final.

**Cambio de paradigma**: ya no es una calculadora puntual sino una
**herramienta de sesión con estado** (cronómetros, eventos, persistencia).
Es la fase más ambiciosa y se aborda al final, con las fases previas ya
publicadas.

### Alcance v1 (mínimo viable)

- **Datos iniciales**: peso, Hb, plaquetas, fibrinógeno, INR/TTPa, calcio
  ionizado. Cálculo de volumen sanguíneo (fórmula de Nadler ya existente).
- **Sesión con cronómetro**: iniciar/pausar, registro rápido de unidades con
  un toque (CH, CP, PFC, CCP, crio, cristaloides, fármacos), con hora.
- **Recordatorios guiados** (recordar, no prescribir):
  - Calcio: por unidades de CH administradas (~cada 4–6 CH) y por iCa
    introducido.
  - Re-análisis de laboratorio: por tiempo transcurrido (p. ej. 60 min) y por
    % del volumen sanguíneo sustituido.
  - Ratios 1:1:1 como guía visual configurable, no como prescripción.
- **Reporte final**: timeline completo de la sesión con totales por
  componente, exportable a impresión/PDF, con disclaimer de "hoja de trabajo,
  no registro oficial de transfusión".

### Requisitos no funcionales (críticos)

- **Offline**: funciona sin red; sin login ni fricción de acceso.
- **Persistencia**: autosave en localStorage; cerrar el navegador no puede
  perder una sesión activa.
- **UX de crisis**: botones grandes, mínimo texto, tema oscuro, cero
  dependencias de navegación profunda.
- **Corrección de errores**: poder borrar/editar una unidad mal apuntada.

### Alcance v2 (diferido)

- Campos para ROTEM/TEG y dosificación guiada por ellos.
- Recordatorio de CCP con dosificación por peso e INR (controversia
  documentada, requiere validación clínica propia).
- Intercambio transfusional neonatal (reutiliza lógica pediátrica de Fase 2).
- Reutilización explícita del wizard de crioprecipitado para fibrinógeno
  objetivo.

**Criterios de aceptación**
- [ ] La sesión sobrevive a un recarga del navegador (autosave).
- [ ] Recordatorios no desaparecen hasta ser confirmados.
- [ ] Reporte final incluye todos los eventos con timestamp y totales.
- [ ] Bordes de tiempo del cronómetro testeados (pausa/reanudación, sesión
  abandonada).

**Tests**: además de unitarios, tests de integración de la sesión completa
(iniciar → registrar unidades → reciben recordatorio → cerrar sesión →
reporte). Es la única fase con estado real: el esfuerzo de test está ahí.

---

## Backlog (sin fase asignada)

Del brainstorm de nuevas funcionalidades, ordenado por utilidad/esfuerzo:

1. Incremento corregido de plaquetas (CCI) y criterio de refractariedad.
2. Dosificación de PFC y crioprecipitado por objetivo de coagulación.
3. Índices eritrocitarios y diferencial de anemias.
4. Ajuste renal de anticoagulantes y oncológicos (CrCl ya reutilizable de F3).
5. Compatibilidad ABO de plasma/plaquetas por título de aglutininas.
6. Conversor de unidades SI ↔ convencionales.
7. Rendimiento de máquina de aféresis (real vs teórico) y coste por
   procedimiento.
8. Planificador de desensibilizaciones. Alcance y contenido clínico
   pendientes de definir con el especialista.
9. Validar bibliográficamente la tabla de volemia pediátrica por peso
   (`src/utils/data/volemiaPediatrica.js`), añadida a petición de un usuario
   para menores de 2 años (y resto de franjas pediátricas). La fuente aún no
   está citada: pendiente de revisión del especialista antes de publicar.

---

## Orden y liberación

| Fase | Funcionalidad | Tamaño | Release objetivo |
|---|---|---|---|
| 1 | Protamina | S | v3.1 |
| 2 | Dosis pediátricas | S | v3.2 |
| 3 | Módulo anticoagulación (switch + perioperatorio + básica) | M | v3.3 |
| 4 | Hemostasia: decisor y dosificación (FIX/FVIIa, VWD/DDAVP, raras BSH) | M | v3.4 |
| 5 | Transfusión masiva (v1) | L | v4.0 |

**Justificación del orden**: las fases 1–2 son quick wins de días; las fases
3 y 4 concentran la carga en contenido clínico; la fase 5 introduce un modelo
de aplicación distinto (sesión con estado) y merece llegar con el resto ya
estable. Las fases 1–4 son independientes entre sí y pueden reordenarse según
prioridad asistencial; la fase 4 puede adelantarse si la demanda asistencial
de hemostasia lo justifica. La fase 5 se mantiene última por tamaño y por el
cambio de paradigma de UX.
