# AGENTS.md

## Repository overview
TJ Droid is an Android-first Expo/React Native app for local field service organization. The product is local-first: there is no backend and no authentication. The main domains are `Reports`, `Stopwatch`, `People`, `Territories`, `Settings`, and `Backup`.

Current architecture:
- bootstrap in `index.js` and `App.tsx`
- navigation in `src/routes/index.tsx`
- screens in `src/screens`
- business logic and persistence in `src/controllers`
- shared components in `src/components`
- persistence via `src/services/AsyncStorageMethods.ts`
- theme via `src/contexts/Theme.tsx` + `styled-components`

## How to run
- `cmd /c yarn start`
- `cmd /c yarn android`
- `cmd /c yarn androidnvm`
- `cmd /c yarn lint`

Android builds:
- `cmd /c yarn apk`
- `cmd /c yarn bundle`
- `cmd /c yarn release`

Notes:
- In the audited environment, running `yarn` directly in PowerShell failed due to policy. Prefer `cmd /c yarn ...`.
- The repository does not have an `ios/` folder, even though the `ios` script exists.

## How to validate changes
Minimum validation:
- run `cmd /c yarn lint`

Additional validation when applicable:
- open the changed flow on Android
- if storage is changed, validate reading old data
- if backup is changed, generate and restore a `.zip`
- if stopwatch is changed, validate start, pause, resume, and stop
- if native Android is changed, validate Android build

Known baseline from audit `2026-04-03`:
- `lint` passes with existing warnings; do not assume a clean baseline

## Mandatory conventions for this project
- Domain changes must go through existing controllers.
- Do not access `@tjdroid:*` directly from a screen if a domain controller already exists.
- Preserve current formats:
  - UI: `dd/MM/yyyy` and `HH:mm`
  - storage: ISO dates when persisted as events
  - monthly logical key: `moment(...).locale("pt").format("MMMM yy")`
- New text must be added to i18n.
- New colors/styles must come from the theme when they are part of the main UI.
- If a mutation affects persisted data, evaluate backup/restore impact.

## What must never be changed without care
- Storage keys `@tjdroid:*`
- Persisted structures in `src/types`
- Central save flow in `Header`
- Persisted stopwatch state in `CronometroComp`
- `relatoriosController` logic that correlates reports with people
- Android signing, Firebase, and Manifest files

Especially sensitive areas:
- `src/components/Header/index.tsx`
- `src/components/CronometroComp/index.tsx`
- `src/controllers/territoriosController.ts`
- `src/controllers/relatoriosController.ts`
- `src/controllers/pessoasController.ts`
- `src/controllers/backupController.ts`

## Dependencies and settings that require attention
- `expo-router` is installed/configured, but it is not the current real navigation
- `android/app/google-services.json` is required locally and ignored by git
- `android/gradle.properties` contains release signing configuration

## Definition of done
A task in this repository should only be considered done when:
- the change respects the domain controller/flow
- it does not break existing storage formats
- i18n was updated if there is new text
- theme was respected if there is new UI
- backup was considered if persisted data changed
- `cmd /c yarn lint` was executed
- residual risks were explicitly stated if manual validation was not enough

## How to approach new implementations
1. Identify the affected domain.
2. Read the corresponding screen and controller before editing.
3. Map involved storage keys, types, and navigation.
4. Discover whether the flow passes through `Header`, `Contador`, or `VisitBox`.
5. Implement the smallest coherent change following the existing pattern.
6. Validate the functional flow and run lint.

## Skills and sub-agents
In the current project state, `AGENTS.md` is enough for most tasks. A skill or sub-agent should only be created if real repetition appears in:
- Android/Firebase build diagnostics
- backup and storage migration checklist
- recurring screen implementation that reuses `Header`, `VisitBox`, and `Contador`
