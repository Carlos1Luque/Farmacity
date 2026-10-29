# Informe de onboarding — `github_skills` / GymLog

> Fecha: 2026-10-20 · Repo analizado: https://github.com/Carlos1Luque/github_skills
> Convención de etiquetas: `[Hecho]` (verificado), `[Suposición]`, `[Recomendación]`.

## 1. Entorno de trabajo verificado

| Herramienta | Estado | Versión |
|---|---|---|
| Git | ✅ verificado | 2.54.0.windows.1 |
| Node.js | ✅ verificado | v22.16.0 |
| .NET SDK | ✅ verificado | 9.0.318 y 10.0.201 |
| ASP.NET Core runtime | ✅ verificado | 8.0.31, 9.0.20, 10.0.5 |
| GitHub CLI (`gh`) | ❌ no instalado | — |

- [Hecho] Con lo instalado se puede hacer la Etapa 1 (HTML/CSS/JS puro, sin dependencias) y la Etapa 2 (ASP.NET Core Web API).
- [Hecho] Autenticación de git con GitHub: verificada con push de prueba y push real.

## 2. Repositorio: estado actual

**Carpeta:** `C:\Users\Admin\Documents\Proyecto predeterminado\github_skills`
**Rama:** `main` (única), sincronizada con `origin/main`, árbol limpio.
**Remoto:** `https://github.com/Carlos1Luque/github_skills.git` (URL sin credenciales embebidas).

**Historial:**
```
1dd8cbe chore: agregar AGENTS.md, CLAUDE.md, .gitignore, LICENSE y README; consolidar plantillas en docs/ai
9a7f2e5 Unificar historial: incorporar skills y configuración de OpenCode (rama master)
c510255 Agregar skills y configuración de OpenCode
88d1113 Initial commit
```

### Problema original detectado y resuelto
- [Hecho] Existían dos ramas con historias sin relación: `main` (solo README, creada por GitHub web) y `master` (commit raíz con todo el contenido, subido con `git push -u origin master`).
- [Hecho] Resolución: merge con `--allow-unrelated-histories` en `main`, push y eliminación de `master` del remoto. Nada se perdió.

## 3. Archivos del repo (estructura final)

```
github_skills/
├── AGENTS.md                 ← reglas que siguen los agentes (aprobaciones, Git seguro, calidad)
├── CLAUDE.md                 ← entrada para Claude Code: lee AGENTS.md y apunta a docs/ai/
├── LICENSE                   ← MIT, © 2026 Carlos1Luque
├── README.md                 ← descripción del kit, skills, cómo usarlo, seguridad
├── .gitignore                ← secretos (.env, *.pem, appsettings.*.local.json), IDE/SO, bin/ obj/
├── docs/ai/                  ← ubicación canónica de las plantillas
│   ├── PROJECT_CONTEXT.md    (plantilla vacía para proyectos que adopten el kit)
│   ├── ARCHITECTURE.md       (plantilla vacía)
│   └── DECISIONS.md          (plantilla vacía)
└── .claude/
    ├── settings.json.example (permisos Claude Code: prohíbe push/reset/clean y leer .env)
    ├── skills/
    │   ├── project-onboarding/SKILL.md
    │   ├── dotnet-api-development/SKILL.md
    │   ├── secure-coding/SKILL.md
    │   ├── secure-git-workflow/SKILL.md
    │   └── testing-qa/SKILL.md
    └── (los 3 docs duplicados fueron eliminados — estaban mal ubicados)
```

### Cambios realizados (commit `1dd8cbe`)
- [Hecho] **Agregados:** `AGENTS.md`, `CLAUDE.md`, `.gitignore` (copiados sin cambios del starter del usuario), `LICENSE` (MIT), `README.md` (reescrito), `docs/ai/` (3 plantillas).
- [Hecho] **Eliminados:** `.claude/ARCHITECTURE.md`, `.claude/DECISIONS.md`, `.claude/PROJECT_CONTEXT.md` y `.claude/ai/` — duplicados idénticos mal ubicados (Git los registró como rename 100% a `docs/ai/`, historial conservado).
- [Hecho] **Sin cambios:** las 5 skills, ambos `.example` de configuración.

## 4. Riesgos

### Resueltos
| Riesgo | Gravedad | Estado |
|---|---|---|
| Dos historias sin relación / rama `master` huérfana | Alta | ✅ unificado en `main` |
| Sin `.gitignore` (basura de build/IDE y secretos se subirían) | Alta | ✅ agregado |
| Sin `AGENTS.md` ni `CLAUDE.md` (las skills los referencian) | Alta | ✅ agregados |
| README de una línea, no publicable | Media | ✅ reescrito |
| Sin licencia (repo público ingobernable legalmente) | Media | ✅ MIT |
| Docs duplicados en `.claude/` y `.claude/ai/` | Media | ✅ consolidados en `docs/ai/` |
| Historial con dos autores distintos ("Carlos1Luque" y "Charlie") | Baja | ⚠️ ver pendiente |

### Pendientes
- [Suposición] El titular de la licencia "Carlos1Luque" es correcto (es el usuario de GitHub); si se quiere nombre legal, se ajusta.
- [Recomendación] Unificar la identidad de git (`git config user.name` / `user.email`) en la máquina local para que los próximos commits tengan un solo autor.
- [Recomendación] Borrar o archivar la copia en `Downloads\vibe-coding-starter` (ya no es necesaria).
- [Recomendación] Activar la protección de rama `main` en GitHub (opcional, repo personal).

## 5. Plan para GymLog (repo aparte — aprobado)

- [Suposición] Nombre del repo: `GymLog` bajo la cuenta `Carlos1Luque`. Confirmar al arrancar.

### Estructura Etapa 1 (HTML/CSS/JS + localStorage)
```
GymLog/
├── index.html
├── css/styles.css
├── js/app.js          (si crece: js/storage.js, js/ui.js)
├── README.md          (qué es, cómo usarla, screenshot, roadmap)
├── .gitignore         (copiar el del kit; cubre Etapa 2 sin tocar nada)
└── LICENSE            (MIT)
```

### Multi-dispositivo (celular y PC)
- Meta viewport + layout flex/grid + objetivos táctiles ≥ 44 px + tema oscuro.
- Etapa 1: **GitHub Pages** (gratis) → funciona desde cualquier dispositivo con la URL.
- Etapa 2: API con HTTPS + CORS con orígenes explícitos.

### Convenciones acordadas
- Commits convencionales: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:` (un cambio coherente por commit).
- Flujo: `main` siempre funcional; ramas cortas `feat/...`, `fix/...` (decidir si con PR o directo a `main`).
- Seguridad: copiar `AGENTS.md`, `CLAUDE.md` y `.gitignore` del kit al iniciar; nada de secretos en el repo; push solo con aprobación explícita.

### Etapa 2 (cuando llegue)
- ASP.NET Core Web API por capas: `Controllers/ → Services/ → Repositories/ (EF Core)`, con `Dtos/` separados de `Entities/` (reglas de las skills `dotnet-api-development` y `secure-coding`).
- JWT + rate limiting en login; tests xUnit + `WebApplicationFactory` (skill `testing-qa`).

## 6. Próximos pasos (esperando tu confirmación)
1. Crear el repo `GymLog` (necesito que me digas si lo creás vos desde la web o si quiero que intente algo desde acá).
2. Armar la estructura base de la Etapa 1 y el primer commit.
3. Definir si usamos PRs con ramas o commits directos a `main`.
