---
name: priority-ticket
description: Trae de Jira (MCP de Atlassian) la tarea de mayor prioridad asignada al usuario en 'Por hacer', resume sus criterios de aceptación, propone un plan de implementación en plan mode y, al aprobarse, la mueve a 'En curso'.
disable-model-invocation: true
---

# /priority-ticket

Recorre estos pasos en orden. No escribas código hasta que el plan esté aprobado.

## 1. Conectar con Jira

- Carga las herramientas del MCP de Atlassian con ToolSearch si aún no están cargadas
  (`getAccessibleAtlassianResources`, `searchJiraIssuesUsingJql`, `getJiraIssue`,
  `transitionJiraIssue`).
- Obtén el `cloudId` con `getAccessibleAtlassianResources` (una sola vez) y reutilízalo en
  todas las llamadas. El sitio de este proyecto es `https://curs-ia.atlassian.net`.

## 2. Buscar la tarea de mayor prioridad

Llama a `searchJiraIssuesUsingJql` con:

```
assignee = currentUser() AND status = "Por hacer" ORDER BY priority DESC, created ASC
```

con un límite pequeño (p. ej. 5). Quédate con el primer resultado.

- Si no hay ninguno, díselo al usuario y para. No cojas tareas sin asignar ni de otros.
- Si hay varias con la misma prioridad máxima, menciona las demás en una línea.

## 3. Leer y resumir el ticket

Llama a `getJiraIssue` con `view: "evidence"` sobre la clave elegida y muestra:

- **Clave, título, prioridad, tipo y sprint**.
- **Resumen** de la descripción en 1-2 frases.
- **Criterios de aceptación**: lista numerada, uno por línea, fieles al ticket (resúmelos sin
  inventar ni añadir criterios).
- **Ambigüedades**: lo que el ticket no especifica y que tendrás que resolver mirando el código
  (por ejemplo, campos que exige un validador del backend).

## 4. Explorar el código y planificar

- Entra en plan mode con `EnterPlanMode`.
- Lee lo necesario del repo para aterrizar el plan: endpoints, validadores y transformers del
  backend que consumirás, y el estado real del frontend (no des por hecho lo que diga
  `AGENTS.md`: comprueba que los componentes, librerías o rutas que mencione existen).
- Presenta el plan con `ExitPlanMode`. Debe incluir:
  - Archivos a crear o modificar.
  - Cómo cubre cada criterio de aceptación (traza criterio → cambio).
  - Dependencias nuevas, si las hay, y por qué.
  - Cómo se verificará (build, lint, pruebas contra la API).
  - Discrepancias encontradas entre el ticket/documentación y el código.

## 5. Al aprobarse el plan

Solo si el usuario aprueba el plan (si lo rechaza o pide cambios, ajústalo y vuelve a presentarlo;
el ticket no se mueve):

1. Mueve el ticket a **En curso**: lista sus transiciones con
   `executeRead({ name: "listJiraIssueTransitions", cloudId, inputs: { issueIdOrKey } })`,
   elige la transición cuyo **destino** (`to.name`) sea `En curso` (en este proyecto suele ser
   el id `21`, pero compruébalo siempre) y llama a `transitionJiraIssue` con ese id. No inventes
   ids.
2. Confirma al usuario el nuevo estado del ticket.
3. Implementa el plan aprobado.

Si la transición falla, informa del error y pregunta antes de continuar. No cambies el estado del
ticket a ningún otro valor ni lo reasignes.
