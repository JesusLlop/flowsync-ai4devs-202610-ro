# AGENTS.md — FlowSync

## Overview
Monorepo: `backend/` (AdonisJS 7, API) + `frontend/` (React 19 + Vite + Tailwind + shadcn/ui).

## Stack y convenciones
- **Frontend**: React 19, componentes de `shadcn/ui` ya disponibles en `frontend/src/components/ui`.
- **Estilo**: Tailwind CSS.
- **Validación / Endpoints**: Consumir la API respetando los endpoints existentes. No inventar rutas nuevas de auth si ya están creadas en el backend.

## Comandos clave
- `npm run dev` (dentro de `frontend/`) — levanta Vite.
- `npm run lint` — revisa estilo.
