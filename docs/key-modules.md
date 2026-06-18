# Key Modules

## Bootstrap and shell
### `App.tsx`
- loads initial settings
- applies theme
- registers notifications
- prepares initial deep link

### `src/routes/index.tsx`
- defines the whole stack
- records navigation analytics

## Infrastructure
### `src/services/AsyncStorageMethods.ts`
- single persistence point
- MMKV first, AsyncStorage as fallback
- lazy migration of legacy keys

### `src/services/PushNotifications.ts`
- local stopwatch notifications
- includes `deepLinkPage`, but notification navigation is still commented in `App.tsx`

### `src/services/AnalyticsCustomEvents.ts`
- minimal wrapper for custom events

## Business rules
### `src/controllers/pessoasController.ts`
- people and visits CRUD
- also builds enriched data for lists

### `src/controllers/territoriosController.ts`
- territories, residences, and visits CRUD
- concentrates sorting, labels, and visual summary rules

### `src/controllers/relatoriosController.ts`
- builds service years
- sums monthly totals
- correlates bible studies with visits in `pessoas`

### `src/controllers/backupController.ts`
- exports/imports storage data to zip
- reads/writes files
- restores known keys

### `src/controllers/configuracoesController.ts`
- loads and saves global settings

## High-impact components
### `src/components/Header/index.tsx`
- most coupled component in the project
- concentrates menus, dialogs, and much of save/edit/delete actions
- used as write gateway for several flows

### `src/components/CronometroComp/index.tsx`
- critical stopwatch business logic
- syncs visual state, AppState, notifications, and storage

### `src/components/Contador/index.tsx`
- base form to save/edit reports
- reused in `CronometroParado`, `RelatorioDetalhes`, and `RelatorioAdicionar`

### `src/components/VisitBox/index.tsx`
- base form for visits in `People` and `Territories`

## Screens that define app behavior
- `src/screens/Home`: main menu
- `src/screens/Configuracoes`: theme, language, privacy policy, rating, external links
- `src/screens/Backup`: manual backup and restore
- `src/screens/Relatorios`: list by service year
- `src/screens/RelatorioMes`: totals and month list
- `src/screens/Pessoas`: people list
- `src/screens/PessoaVisitas`: history per person
- `src/screens/Territorios`: territories list
- `src/screens/TerritorioResidencias`: residence list/grid
- `src/screens/TerritorioResidenciasVisitas`: history per residence

## Apparently residual dependencies or technical ambiguity
- `expo-router`: installed/configured, no real use in current routes
- `jotai`: dependency installed with no usage found in audited code
- `react-native-firebase/crashlytics`: native plugin/config present; direct JS usage did not appear in the audit
