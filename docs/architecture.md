# Architecture

## Relevant structure
- `App.tsx`: bootstrap, theme, splash, notifications, initial deep link
- `src/routes`: single stack navigation
- `src/screens`: screens by domain
- `src/components`: shared components and form/action wrappers
- `src/controllers`: business rules and persistence by domain
- `src/services`: cross-cutting infrastructure
- `src/contexts`: global theme context
- `src/themes`: concrete themes
- `src/i18n`: initialization and dictionaries
- `src/types`: persisted data contracts
- `android/`: native Android project

## Execution flow
### Bootstrap
- `index.js` imports `./src/i18n` before registering the root component.
- `App.tsx` loads settings from `@tjdroid:config`.
- Active theme goes to `ThemeContext` and then to `ThemeProvider`.

### Navigation
The app uses a single stack in `src/routes/index.tsx`.

Main flows:
- `Home -> Territorios -> TerritorioResidencias -> TerritorioResidenciasVisitas -> TerritorioResidenciaNovaVisita|EditarVisita|Informacao`
- `Home -> Pessoas -> PessoaVisitas -> PessoaNovaVisita|PessoaEditarVisita`
- `Home -> Relatorios -> RelatorioMes -> RelatorioAdicionar|RelatorioDetalhes`
- `Home -> Cronometro -> CronometroParado`
- `Home -> Configuracoes -> Ajuda|Backup`

Notes:
- Most screens use their own `Header` and disable the default stack header.
- `NavigationContainer` records screen analytics in `onStateChange`.

## State
There is no global domain store.

Real global state:
- `ThemeContext`: current theme

Predominant local state:
- Each screen uses `useState` for list/loading/reload
- Many screens reload data with `useIsFocused` + `reload` boolean

Persisted state:
- Controllers read/write directly to storage
- `CronometroComp` persists stopwatch state in dedicated keys

## Services and data
### Persistence
`src/services/AsyncStorageMethods.ts`:
- tries MMKV
- migrates `@tjdroid:*` keys from AsyncStorage to MMKV
- falls back to AsyncStorage when MMKV is not available

### Controllers
Dominant pattern:
- screen calls controller
- controller reads/writes storage
- controller also formats/sorts data for display

Consequence:
- controllers mix persistence, aggregation, localization, sorting, and part of business logic

## Domains
### People
- storage: `@tjdroid:pessoas`
- structure: person with `visitas[]`
- controller: `src/controllers/pessoasController.ts`
- main UI: `Pessoas`, `PessoaVisitas`, `VisitBox`

### Territories
- storage: `@tjdroid:territorios`
- structure: territory with `informacoes` and `casas[]`; each house has `visitas[]`
- controller: `src/controllers/territoriosController.ts`
- main UI: `Territorios`, `TerritorioResidencias`, `TerritorioResidenciasVisitas`, `TerritorioInformacao`

### Reports
- storage: `@tjdroid:relatorios` and `@tjdroid:meses_trabalhados`
- controller: `src/controllers/relatoriosController.ts`
- important rule:
  - grouping by month using `pt` locale for key `MMMM yy`
  - service year is calculated from controller logic
  - monthly bible study total comes from `@tjdroid:pessoas`, not reports

### Stopwatch
- central component: `src/components/CronometroComp/index.tsx`
- persists counting and metadata in storage
- uses local notifications to indicate started/paused state
- on stop, redirects to `CronometroParado`, which reuses `Contador`

## Themes and UI
- theme comes from `ThemeContext` + `styled-components`
- `src/themes/index.ts` lists available themes
- `Configuracoes` changes theme and language
- `react-native-paper` is present, but the dominant styling remains `styled-components`

## Internationalization
- `src/i18n/index.ts` detects saved language or device language
- supported languages: `en`, `pt`, `es`, `ru`, `pl`, `uk`
- several month formats depend on `moment`/`moment-with-locales`
- several flows use `pt` locale as logical key and user locale only for display

## Native integrations
- Android with New Architecture enabled
- Firebase Analytics and Crashlytics applied in Gradle
- Expo Notifications for local notifications
- zip file backup with Android Downloads access
