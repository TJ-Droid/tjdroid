# Development Workflow

## Practical requirements
- Node installed
- Dependencies already present in `node_modules/` in the current workspace
- `android/app/google-services.json` present locally for Firebase builds
- Release keystore configured in `android/gradle.properties`

## Project commands
- `cmd /c yarn start`: starts Expo
- `cmd /c yarn android`: runs `expo run:android`
- `cmd /c yarn androidnvm`: uses Node `20.19.4` before Android run
- `cmd /c yarn ios`: runs `expo run:ios` on macOS with Xcode
- `cmd /c yarn lint`: runs `expo lint`
- `cmd /c yarn gc`: cleans Gradle in `android/`
- `cmd /c yarn apk`: `assembleRelease`
- `cmd /c yarn bundle`: `bundleRelease`
- `cmd /c yarn release`: `yarn android --variant=release`

Note:
- In this environment, `yarn` via PowerShell failed due to script policy. `cmd /c yarn ...` worked.

## Current validation state
Audit executed on `2026-04-03`:

- `cmd /c yarn lint`: success with `0 errors` and `162 warnings`

Warning pattern:
- `react-hooks/exhaustive-deps`
- unused imports/identifiers
- `eqeqeq`
- `import/no-named-as-default`

## Recommended flow to work on the project
1. Identify the affected domain: `People`, `Territories`, `Reports`, `Stopwatch`, `Settings`, `Backup`.
2. Read the involved screen and corresponding controller.
3. Confirm which `@tjdroid:*` keys are read/written.
4. Confirm whether there is impact on `Header`, `VisitBox`, `Contador`, or `CronometroComp`.
5. If there is impact on dates/months, validate `moment` usage with `pt` locale.
6. If there is language impact, review `src/i18n` and JSON keys.
7. If there is native Android impact, review Gradle, Manifest, and involved permission/file.
8. Run at least lint; if the change touches native Android or backup/notifications, also validate on device/emulator.

## What does not exist today
- automated test suite
- CI
- external backend/API
- authentication
- versioned `ios/` folder in the repository
