# Implementation Rules In This Project

## Real code conventions
- Domain data reads/writes happen through controllers, not directly in screens.
- Each screen tends to reload data in `useEffect` when `useIsFocused()` changes.
- Mutations usually trigger `ToastAndroid` and then toggle a `reload` boolean.
- UI dates use `dd/MM/yyyy` and `HH:mm`; persistence usually uses ISO strings.
- Monthly grouping keys use `moment(...).locale("pt").format("MMMM yy")`.
- Theme comes from `ThemeContext` and `styled-components`.
- App language is persisted in `@tjdroid:idioma`.

## What an agent must always know
- `Header` is not only visual; it executes several business operations.
- `Reports` depend on `People` to calculate bible studies.
- `Stopwatch` persists state outside the React tree; changes must preserve key compatibility.
- `Territories` and `People` store visits in nested structures; mutations usually read the whole array, change inner item, and save everything back.
- Backup/restore assumes exact file names and keys.

## Before changing any feature
- Read the screen
- Read the corresponding controller
- Identify affected storage keys
- Identify whether the flow passes through `Header`, `Contador`, or `VisitBox`
- Check i18n impact
- Check theme impact
- Check backup impact

## When changing reports
- Preserve `pt` locale usage for `mesAno` key
- Confirm effect on `meses_trabalhados`
- Confirm whether the change alters bible study calculation

## When changing people or territories
- Respect the persisted format in `src/types`
- Avoid changing storage field names without migration
- Validate create, edit, and cascade delete

## When changing stopwatch
- Preserve compatibility of:
  - `@tjdroid:contador_iniciado`
  - `@tjdroid:contador_completo`
  - `@tjdroid:started_time`
  - `@tjdroid:started_time_message`
- Validate start, pause, resume, and stop
- Validate app return from background
- Validate local notifications

## When changing native Android
- Review `google-services.json`
- Review notification and storage permissions
- Review release signing

## Avoid
- Creating new global state without real need
- Duplicating storage access outside controllers
- Changing date formats without tracking all domains
- Changing `expo-router` configuration assuming it is in use
