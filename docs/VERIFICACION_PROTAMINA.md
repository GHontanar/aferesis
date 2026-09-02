# Verificación documental — Calculadora de protamina (Fase 1 del ROADMAP)

**Fecha de consulta**: 3 de septiembre de 2026
**Método**: descarga directa de las fichas técnicas (SmPC) vigentes en CIMA
(AEMPS) y del label FDA vía DailyMed. Se citan los textos literales de las
secciones relevantes. **Ningún dato de esta calculadora debe implementarse sin
estar en este documento con su fuente.**

---

## 1. Fuentes consultadas

| # | Documento | Sección | Fecha revisión texto | URL |
|---|---|---|---|---|
| F1 | FT Protamina Hospira 10 mg/ml (Nº reg. 45.777) | 4.2, 4.4, 5.1 | mayo 2020 | cima.aemps.es/cima/dochtml/ft/45777/FT_45777.html |
| F2 | FT Protamina sulfato LEO Pharma 1.400 UI anti-heparina (10 mg)/ml (Nº reg. 86.529) | 4.2, 4.4, 5.1 | 09/2014 | cima.aemps.es/cima/dochtml/ft/86529/FT_86529.html |
| F3 | FT Clexane (enoxaparina sódica, Nº reg. 58.503 y presentaciones compartidas) | 4.9 | octubre 2022 | cima.aemps.es/cima/dochtml/ft/58503/FT_58503.html |
| F4 | FT Hibor 2.500 / 3.500 UI anti-Xa (bemiparina, Nº reg. 61.907) | 4.9, 5.1, 5.2 | 05/2023 | cima.aemps.es/cima/dochtml/ft/61907/FT_61907.html |
| F5 | FT Fraxiparina 0,6 ml (nadroparina, Nº reg. 58.982) | 4.9, 5.1, 5.2 | agosto 2017 | cima.aemps.es/cima/dochtml/ft/58982/FT_58982.html |
| F6 | Label FDA Protamine Sulfate injection, USP (Fresenius Kabi) vía DailyMed | Dosage & Administration, Warnings | nov 2024 | dailymed.nlm.nih.gov (setid c76876da-b9a8-45d0-9278-7df3288d3a06) |

---

## 2. HNF — bolo IV

### Textos literales

**F1 (Protamina Hospira), sección 4.2:**

> "Como regla general, se administra 1 mg de sulfato de protamina (0,1 ml de
> solución inyectable) por cada 100 U.I. de heparina a neutralizar si el tiempo
> transcurrido desde la administración de la heparina es menor de 15 minutos.
> Cuando el tiempo transcurrido es mayor de 15 minutos, se reducirá
> proporcionalmente la cantidad de sulfato de protamina, hasta llegar a la
> mitad, cuando el tiempo transcurrido sea de 30 minutos, es decir, si han
> pasado más de 30 minutos la dosis deberá ser de 0,5 mg de protamina por cada
> 100 U.I. de heparina y así sucesivamente."

**F1, sección 4.2:** "No debe administrarse en una sola dosis más de 50 mg."
**F1, sección 4.2:** "La administración por vía intravenosa debe hacerse de
forma lenta durante un periodo aproximado de unos 10 minutos (velocidad de
perfusión <5 mg/min)".
**F1, sección 4.2/4.4:** control de TTPA o TCA "de 5 a 15 minutos después de
la administración".
**F1, sección 4.4:** "efecto anticoagulante de rebote... en el intervalo
comprendido entre los 30 minutos y las 18 horas".

**F2 (Protamina LEO), sección 4.2:** "1 ml (10 mg) neutralizará
aproximadamente 1.400 UI de heparina. Puesto que la heparina posee una semivida
relativamente corta cuando se administra por vía intravenosa (30 minutos -
2 horas), la dosis debe ajustarse en base al tiempo transcurrido... La dosis
debe reducirse si han transcurrido más de 15 minutos desde la finalización de
la inyección intravenosa de heparina." Máximo bolo: 5 ml (50 mg).

**F6 (label FDA):** "Each mg of protamine sulfate neutralizes not less than
100 USP Heparin Units... given by very slow intravenous injection over a
10-minute period in doses not to exceed 50 mg... For example, if the protamine
sulfate is administered 30 minutes after the heparin, one-half the usual dose
may be sufficient."

### ⚠️ Corrección importante respecto a mi propuesta inicial

La **tabla discreta de 4 tramos** que propuse de memoria (< 30 min: 1,0;
30–60: 0,5; 60–120: 0,375; > 120: 0,25) **NO aparece en ninguna de las fuentes
primarias consultadas** (ni FT españolas ni label FDA). Procede de literatura
secundaria/protocolos hospitalarios no verificados. **Queda descartada.**

Las fuentes españolas dan una regla proporcional no operacionalizada
("reducirá proporcionalmente... hasta la mitad a los 30 minutos... y así
sucesivamente"). Para implementar hay que fijar una interpretación explícita.
**Pendiente de decisión del especialista** (ver §7).

### Regla HNF bolo validada para implementación

```
factor(t):
  t < 15 min            → 1,0
  15 ≤ t                → reducción proporcional: 0,5 en t = 30 min
                          e interpretación de "y así sucesivamente" PENDIENTE
protamina_mg = (UI_heparina / 100) × factor(t)
cap: 50 mg por dosis única (todas las fuentes)
administración: IV lenta ~10 min, < 5 mg/min
recontrol TTPA/TCA: 5–15 min (no 15–30 como propuse inicialmente)
aviso: rebote anticoagulante 30 min–18 h post-protamina
```

---

## 3. HNF — perfusión continua y vía subcutánea

**F2, sección 4.2:** "La absorción prolongada tras administración subcutánea
de heparina o HBPM puede ser indicativo de que deben administrarse dosis
repetidas [de protamina]." (efecto depósito)

**F2, sección 4.2:** "En general, la dosis debe establecerse a partir de los
resultados de pruebas de coagulación sanguínea" (TTPA, TCA, anti-Xa, ensayo de
neutralización con protamina).

**Pendiente**: la recomendación "perfusion → parar y valorar 25–50 mg titrando
a TTPA" (modo C acordado) no procede de ninguna FT: es práctica clínica
protocolizada. Citarla como fuente requiere o bien un protocolo hospitalario de
referencia o dejar solo el texto de F2 ("establecer a partir de pruebas de
coagulación"). **Decisión del especialista.**

---

## 4. Enoxaparina (HBPM de referencia para MVP)

### Texto literal — F3 (Clexane), sección 4.9:

> "Los efectos pueden ser ampliamente neutralizados por la inyección IV lenta
> de protamina. La dosis de protamina depende de la dosis de enoxaparina
> sódica inyectada; **1 mg de protamina neutraliza el efecto anticoagulante de
> 100 UI (1 mg) de enoxaparina sódica, dentro de las 8 horas siguientes** a la
> administración de la enoxaparina sódica. En caso de **superar las 8 horas**
> tras la administración de la enoxaparina sódica, o si es necesaria una
> segunda dosis de protamina, se podrá proceder a la **perfusion de 0,5 mg de
> protamina por 100 UI (1 mg) de enoxaparina**. Después de **12 horas** de la
> administración de la inyección de enoxaparina sódica, ya no será necesario
> administrar protamina. No obstante, incluso con dosis elevadas de protamina,
> la actividad anti-Xa de enoxaparina sódica nunca es totalmente neutralizada
> (un **máximo del 60 %**)."

### Regla enoxaparina validada para implementación

```
t < 8 h      → 1 mg protamina / 1 mg enoxaparina (IV lenta)
8 ≤ t < 12 h → 0,5 mg protamina / 1 mg enoxaparina, EN PERFUSIÓN
t ≥ 12 h     → no es necesaria protamina
cap 50 mg/dosis; segunda dosis (depósito SC) → 0,5 mg/mg en perfusión
aviso: neutralización parcial — anti-Xa máximo ~60 % incluso a dosis altas
```

### Regla adicional de F1 (Protamina Hospira) — vida media HBPM

**F1, sección 4.2:** "En el caso de HBPM, con vida media más larga y
administración subcutánea, se recomienda que **cuando haya pasado más de una
vida media de la HBPM se divida en dos la dosis calculada** de sulfato de
protamina y se administre en inyecciones intermitentes o en perfusión
continua."

Vidas medias según tabla de F1: **bemiparina 5,3 h · dalteparina 2 h ·
enoxaparina 4 h · nadroparina 8–10 h · tinzaparina 1,5 h**.

→ Regla nueva a incluir: si t > vida media del fármaco, dividir la dosis
calculada en dos administraciones. (Para enoxaparina: t > 4 h → dividir.)

---

## 5. Otras HBPM — estado de la evidencia (verificado)

### Bemiparina — F4 (Hibor), sección 4.9, revisión 05/2023:

> "El sulfato de protamina produce un descenso parcial de la actividad anti-Xa
> durante las 2 horas siguientes a su administración intravenosa, a una dosis
> de **1,4 mg de sulfato de protamina por cada 100 UI anti-Xa** administradas."

**⚠️ Corrección relevante**: la FT vigente (05/2023) SÍ recoge un ratio
concreto para bemiparina (1,4 mg/100 UI anti-Xa, basado en estudios in vitro e
in vivo con descenso parcial de anti-Xa). Esto contradice la impresión previa
de que "no hay nada concreto" — lo que probablemente ocurrió es que se buscó en
versiones anteriores de la FT o en materiales del fabricante sin actualizar.
Coherente con anti-Xa/anti-IIa ≈ 8 (F4, sección 5.1) y semivida 5–6 h (F4,
5.2.4). Útil clínicamente en España por su uso extendido. **Requiere validación
del especialista antes de calcularse automáticamente.**

### Nadroparina — F5 (Fraxiparina), sección 4.9, revisión agosto 2017:

> "**0,6 ml de sulfato de protamina neutralizan aproximadamente 950 UI anti-Xa
> de nadroparina.** En el cálculo de la cantidad de protamina a inyectar debe
> tenerse en cuenta el tiempo transcurrido desde la administración de
> heparina, pudiendo decidirse una reducción de la dosis."

Con protamina 10 mg/ml (F1/F2): 0,6 ml = 6 mg → **≈ 0,63 mg por 100 UI
anti-Xa** (derivación nuestra, no literal de la FT — señalar en la UI).
Nota: mi recuerdo inicial ("0,6 mg por 0,1 ml") era incorrecto en unidades.
**Fraxiparina consta como NO comercializada en España actualmente** (CIMA,
comerc: false en todas las presentaciones) — prioridad baja.

### Dalteparina

No localizada en CIMA (no comercializada en España). Con ratio documentado en
su SmPC internacional (1 mg/100 UI) pero fuera de alcance del MVP. Backlog.

### Tinzaparina / reviparina / fondaparinux

No verificadas documentalmente en esta pasada. Fondaparinux: sin antídoto
protamina (pendiente de verificar FT si se incluye en la UI).

---

## 6. Afirmaciones de mi propuesta inicial — estado tras verificación

| Afirmación original | Estado | Fuente |
|---|---|---|
| 1 mg / 100 UI HNF (< 15 min en FT española) | ✅ confirmada | F1, F2, F6 |
| Tabla discreta 0,5/0,375/0,25 por tramos | ❌ NO verificada en fuentes primarias — descartada | — |
| Cap 50 mg por dosis única | ✅ confirmada | F1, F2, F6 |
| IV lenta ≤ 5 mg/min (~10 min) | ✅ confirmada | F1, F6 |
| Recontrol TTPA/TCA "15–30 min" | ⚠️ corregida: 5–15 min | F1, F2 |
| Enoxaparina 1 mg/mg < 8 h | ✅ confirmada | F3 |
| Enoxaparina 0,5 mg/mg 8–12 h | ✅ confirmada, en PERFUSIÓN | F3 |
| Enoxaparina > 12 h sin antídoto | ✅ confirmada | F3 |
| Anti-Xa revertida 60–75 % | ⚠️ corregida: máx 60 % | F3 (LEO in vitro: 46 %) |
| Segunda dosis 0,5 mg/mg por depósito SC | ✅ confirmada (F3: perfusión 0,5 mg/mg) | F3, F2 |
| Regla "si t > vida media HBPM, dividir dosis en dos" | ➕ NUEVA, de fuente primaria | F1 |
| Perfusión HNF: "25–50 mg titrando a TTPA" | ⚠️ sin fuente FT — decidir citación | práctica clínica |
| Bemiparina: sin ratio validado | ⚠️ corregida: 1,4 mg/100 UI anti-Xa en FT 05/2023 | F4 |
| Nadroparina 0,6 mg / 0,1 ml | ⚠️ corregida: 0,6 ml (6 mg) / 950 UI anti-Xa | F5 |
| Bemiparina anti-Xa/anti-IIa ≈ 8 | ✅ confirmada | F4 |

---

## 7. Decisiones pendientes del especialista antes de codificar

1. **Interpretación de "proporcionalmente... y así sucesivamente" (HNF > 15
   min)**. Opciones:
   - a) Interpolación lineal de 1,0 en t=15 a 0,5 en t=30, y continuar la
     misma pendiente hasta 0 en t=60 (0 desde t ≥ 60).
   - b) Reducción continua de 1,0 a 0,5 en 30 min y mantener 0,5 después
     (conservadora, nunca menor de 0,5).
   - c) Otra interpretación clínica que el especialista considere correcta.
2. **Cita para el modo perfusión continua (C)**: ¿se usa un protocolo
   hospitalario de referencia como fuente, o solo el texto de F2 ("dosis
   establecida a partir de pruebas de coagulación") sin cifras?
3. **¿Incluir bemiparina con cálculo (1,4 mg/100 UI) en v1** o solo como
   pantalla informativa pendiente de validación?
4. **Vía SC de heparina**: F2 solo dice "pueden ser necesarias dosis
   repetidas" — ¿fijar una regla concreta de repetición o texto libre?
5. Confirmación final de todos los textos de aviso (hipersensibilidad: alergia
   al pescado, vasectomía, infertilidad masculina, insulina-protamina, previa
   exposición — F1/F2/F6 coinciden).

---

## 8. Fórmula de cita en la UI

Cada resultado mostrará: nombre del documento + sección + fecha de revisión +
fecha de consulta. Ejemplo:

> Fuente: Ficha Técnica Protamina Hospira 10 mg/ml, sección 4.2 (rev. mayo
> 2020). Consultado el 03/09/2026 en CIMA (AEMPS).
