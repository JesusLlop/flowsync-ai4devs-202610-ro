---
name: commit
description: Crea un commit convencional tipo(scope): descripción a partir de los cambios preparados (staged) en git.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*)
---

# /commit

Crea **un** commit con los cambios que ya están en el staging area. No hagas `git add` ni
`git push`: lo que se commitea lo decide el usuario al preparar los cambios.

## Contexto

- Estado: !`git status --short`
- Cambios preparados (resumen): !`git diff --staged --stat`
- Últimos commits (para seguir el estilo): !`git log --format=%s -10`

## Pasos

1. Si no hay cambios preparados, díselo al usuario, muéstrale los archivos modificados que hay
   y para. No prepares nada por tu cuenta.
2. Lee el diff completo con `git diff --staged` para entender qué cambia y por qué.
3. Redacta el mensaje con el formato de Conventional Commits:

   ```
   tipo(scope): descripción

   cuerpo opcional
   ```

   - **tipo**: `feat` (funcionalidad nueva), `fix` (corrección), `refactor`, `style`, `perf`,
     `test`, `docs`, `build` (dependencias, Vite, tsconfig), `ci` o `chore`.
   - **scope**: la zona del monorepo afectada: `frontend`, `backend`, `docs`, `claude`
     (configuración y skills de `.claude/`), o uno más concreto si aporta (`auth`, `ui`…). Si el
     cambio abarca varias zonas sin una dominante, omite el scope.
   - **descripción**: en español, en minúscula, en imperativo o presente, sin punto final y de
     72 caracteres como máximo en la primera línea, igual que el historial del repo.
   - **cuerpo**: solo si el *porqué* no es evidente o hay varios cambios relevantes; líneas de
     72 caracteres como máximo. Si hay un ticket de Jira asociado (por la rama o la
     conversación, p. ej. `FLOW-1`), añade `Refs: FLOW-1` al final.
   - Cambios incompatibles: `tipo(scope)!:` y una línea `BREAKING CHANGE:` en el cuerpo.
4. Si los cambios preparados mezclan temas que no tienen relación entre sí, avisa al usuario y
   sugiere separarlos en varios commits antes de seguir.
5. Haz el commit pasando el mensaje con un heredoc (`git commit -F - <<'EOF' … EOF`) e incluye
   los trailers de atribución que indique el entorno.
6. Muestra el resultado con `git log -1 --stat`. Si un hook de pre-commit falla, enseña el
   error, corrige el problema y crea un commit nuevo (nunca `--amend` ni `--no-verify`).
