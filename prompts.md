# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Consulta el ticket FLOW-1 en Jira utilizando las herramientas MCP disponibles, lee sus criterios de aceptación e implementa la tarea requerida en el proyecto.
```

**Qué salió:** LEl agente leyó el ticket en Jira, planificó el trabajo e instaló los componentes necesarios. Completó la tarea a la primera y sin ningún error de código ni de diseño.

---

## Prompt 2 (Entorno Sin Harness)

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

*Nota: Dado que el entorno sin harness no dispone de integración MCP con Jira, se le proporcionó de forma explícita el contenido completo del ticket FLOW-1:*

```
Título: Formulario de registro y login en el frontend de FlowSync

Descripción: Necesitamos que los usuarios puedan registrarse e iniciar sesión en la aplicación frontend consumiendo la API del backend de autenticación que ya está disponible.

Criterios de aceptación:
Crear la vista o formulario de Login y Registro en el frontend (frontend/src).
El registro debe enviar los datos al endpoint de registro del backend (POST /api/v1/auth/signup) y el login a su endpoint correspondiente (POST /api/v1/auth/login).
Al iniciar sesión con éxito, guardar el token de acceso y mostrar un estado de sesión activa o redirigir a la vista de perfil.
Si las credenciales son inválidas o la validación del backend falla, debe mostrarse un mensaje de error claro en pantalla.
Utilizar los componentes visuales existentes de UI (shadcn/ui / Tailwind) para mantener consistencia con el diseño.
```


**Qué salió:** Hizo la pantalla de login funcionando, pero cometió fallos por el camino: instaló un paquete que no hacía falta, desconfiguró un archivo del proyecto y dejó avisos de error en los botones.
