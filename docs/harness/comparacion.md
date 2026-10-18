# Comparativa A/B: Con Harness vs. Sin Harness

## Parte A: Comparación de Ejecución

| Casilla / Pregunta | Con Harness (`flowsync-ai4devs-202610-ro`) | Sin Harness (`flowsync-sin-harness`) |
| :--- | :--- | :--- |
| **1. Archivos que propone tocar (contados)** | **10 archivos en total**: <br>• `frontend/vite.config.ts`<br>• `frontend/tsconfig.app.json`<br>• `frontend/components.json`<br>• `frontend/src/lib/utils.ts`<br>• `frontend/src/lib/api.ts`<br>• `frontend/src/components/auth-form.tsx`<br>• `frontend/src/components/profile-view.tsx`<br>• `frontend/src/App.tsx`<br>• Componentes `shadcn` base en `src/components/ui/` (button, input, label, card, alert)<br>• Limpieza: eliminación de `App.css` y assets de plantilla. | **9 archivos en total**: <br>• `frontend/vite.config.ts`<br>• `frontend/tsconfig.json`<br>• `frontend/src/lib/utils.ts`<br>• `frontend/src/lib/api.ts`<br>• `frontend/src/pages/login.tsx`<br>• `frontend/src/pages/signup.tsx`<br>• `frontend/src/pages/profile.tsx`<br>• `frontend/src/App.tsx`<br>• Componentes `shadcn` en `src/components/ui/` |
| **2. Convenciones que respetó y cuáles no** | **Respetó**: <br>• Arquitectura modular con shadcn/ui y Tailwind v4.<br>• Aliases TypeScript (`@/`).<br>• Estándares de Linter (`npm run lint` pasó 100% limpio).<br>• Tipado estricto sin errores de compilación (`tsc`).<br>**Violó**: Ninguna. | **Respetó**: <br>• Alias de TypeScript (`@/`).<br>• Tipado básico.<br>**Violó**: <br>• Convenciones de Linting (dejó *warnings* en `button.tsx`).<br>• Rompió la configuración de TS al intentar usar `baseUrl` en TS 6.<br>• No había convenciones explícitas escritas en la copia sin harness. |
| **3. Intervenciones humanas requeridas** | **0 intervenciones**: Leyó el ticket en Jira mediante MCP, detectó la falta de dependencias en Vite, las instaló y pasó los hooks de validación sin ayuda. | **0 intervenciones**: Completó el flujo de forma autónoma, aunque gastó ciclos de ejecución adicionales corrigiendo la instalación de un paquete erróneo de npm (`cn`). |
| **4. Trabajo a arreglar a mano** | **Ninguno**: El build y el linter pasaron totalmente limpios y los endpoints se validaron con `curl`. | **Limpieza manual de linter**: Arreglar los *warnings* de ESLint en `button.tsx` y revisar la configuración limpia del `tsconfig.json`. |

---

## Parte B: Las Tres Líneas

1. **Hasta qué pieza llegaste, y cuál te costó más de lo que esperabas:**
   Llegué hasta la pieza **2 y 6/8** (archivo de instrucciones `CLAUDE.md`/`AGENTS.md`, conexión MCP con Jira funcionando y hooks de validación/linting en `.claude/settings.json`). Las skills personalizadas (`/priority-ticket`, `/commit`) y el subagente `adversarial-reviewer` quedaron pendientes por tiempo. Lo que más tiempo tomó fue configurar el hook `PostToolUse` del linter.

2. **La primera diferencia que viste entre las dos salidas, y en qué te fijaste para verla:**
Lo primero que noté fue lo limpio y ordenado que dejó todo la versión **Con Harness** comparada con la otra. La versión con harness instaló el diseño (Tailwind/shadcn) a la primera y sin ningún fallo. En cambio, la versión **Sin Harness** se lió sola: instaló un paquete de código que no tocaba (`cn`), desconfiguró un archivo de opciones (`tsconfig`) y dejó avisos de fallo en un botón. Me di cuenta al mirar la consola de comandos al terminar y al pasar el comprobador de código (`npm run lint`)

3. **Algo que dejaste escrito en el harness y que el agente no cumplió igualmente:**
   A pesar de que las guías indicaban que el proyecto ya contaba con shadcn/ui instalado, ambos agentes descubrieron que el frontend era solo la plantilla base de Vite. Aunque el agente *Con Harness* resolvió la inconsistencia sin romper nada, demuestra que las instrucciones escritas aumentan drásticamente la probabilidad de éxito pero no garantizan que el entorno real coincida al 100% con lo documentado.
