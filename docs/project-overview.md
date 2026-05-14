# TJ Droid: Project Overview

## App objective
TJ Droid is an Android-first app for local field service organization, with iOS support also present in code. The product core revolves around four areas:

- `Reports`: manual record of time and totals per month.
- `Stopwatch`: persisted counter that remains coherent between foreground/background.
- `People`: interested people and visit history.
- `Territories`: territories, residences, and visits per residence.

The app does not depend on its own backend or authentication. Main data stays on the device.

## Real stack
- Expo SDK 54 with React Native `0.81.5` and React `19.1.0`
- TypeScript with `strict: true`
- Navigation with `@react-navigation/native` + `native-stack`
- UI with `styled-components`, `react-native-paper`, `FlashList`
- i18n with `i18next` + `react-i18next` + `react-native-localize`
- Persistence with `react-native-mmkv` and fallback to `@react-native-async-storage/async-storage`
- Versioned native Android in `android/`
- Firebase Analytics and Crashlytics on Android
- Expo Notifications for local stopwatch notifications
- Manual backup via `react-native-fs`, `react-native-zip-archive`, `expo-document-picker`, and `expo-sharing`

## Current repository state
- Main platform: Android
- Codebase supports iOS, but `ios/` folder is not versioned and needs generation on macOS
- There are no automated tests in the repository
- There is no CI in `.github/workflows`
- `expo-router` is installed and configured in `app.json`/`app.config.js`, but real navigation uses React Navigation and there is no `src/app`

## How the app starts
1. `index.js` registers the app and initializes i18n.
2. `App.tsx` mounts `ThemeContextProvider`, applies theme, initializes notifications, and loads persisted settings.
3. `src/routes/index.tsx` builds a `NavigationContainer` with a single stack and records screen views in Firebase Analytics.

## Main persistence
Recurring storage keys:

- `@tjdroid:config`
- `@tjdroid:idioma`
- `@tjdroid:relatorios`
- `@tjdroid:meses_trabalhados`
- `@tjdroid:pessoas`
- `@tjdroid:territorios`
- `@tjdroid:contador_iniciado`
- `@tjdroid:contador_completo`
- `@tjdroid:started_time`
- `@tjdroid:started_time_message`

## Already visible high-impact risks
- `android/gradle.properties` contains release signing credentials.
- `Header` concentrates many save/edit/delete actions and became a high-coupling point.
- `CronometroComp` and large controllers concentrate critical business rules.
- `expo-router`/`src/app` look like leftover configuration and can confuse future changes.
