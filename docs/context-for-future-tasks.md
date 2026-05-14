# Persistent Context For Future Tasks

## Operational summary
- Local-first, Android-first app
- No backend and no auth
- Real navigation with React Navigation
- Main persistence in MMKV/AsyncStorage
- Business rules concentrated in controllers and in `Header`/`CronometroComp`

## What to check first for each task type
### New screen
- whether it enters the stack in `src/routes/index.tsx`
- whether it needs standard `Header` or custom header
- whether a reusable component already exists (`Contador`, `VisitBox`, `DialogModal`)

### CRUD adjustment
- domain controller
- persisted type in `src/types`
- messages/toasts and i18n texts

### Report adjustment
- `src/controllers/relatoriosController.ts`
- `src/screens/RelatorioMes`
- indirect dependency on `@tjdroid:pessoas`

### Visit adjustment
- `src/components/VisitBox`
- `People` or `Territories` controller
- `SelectPicker` labels

### Stopwatch adjustment
- `src/components/CronometroComp`
- `src/services/PushNotifications`
- `src/screens/CronometroParado`

### Settings/theme adjustment
- `src/screens/Configuracoes`
- `src/controllers/configuracoesController.ts`
- `src/contexts/Theme.tsx`
- `src/themes/*`

### Backup adjustment
- `src/controllers/backupController.ts`
- keys restored manually
- `src/screens/Backup`

## Fragilities that require context
- `Header` has 1600+ lines and many responsibilities
- `CronometroComp` has 1100+ lines and complex persisted state
- large controllers with manual nested array mutation
- dependency on `pt` locale for logical month key
- release credentials in a versioned file
- `expo-router` configured without real use

## Checklist before implementing any new feature
- Did I understand which domain this flow touches?
- Did I read the screen and domain controller?
- Did I map the involved storage keys?
- Did I verify whether the feature must appear in backup/restore?
- Did I verify whether the text must be added to all languages?
- Did I verify whether theme/colors come from theme and are not hardcoded?
- Did I verify whether the feature goes through `Header`?
- Did I verify whether the feature needs analytics?
- Did I run `cmd /c yarn lint` at the end?
