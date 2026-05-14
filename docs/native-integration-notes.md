# Native Integrations And Android Notes

## Versioned native Android
The repository keeps `android/` versioned and uses Expo Bare/Prebuild as base.

Main files:
- `android/app/build.gradle`
- `android/build.gradle`
- `android/gradle.properties`
- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/java/dev/pedropaulo/tjdroid/MainApplication.kt`
- `android/app/src/main/java/dev/pedropaulo/tjdroid/MainActivity.kt`

## What is enabled
- Hermes
- New Architecture
- edge-to-edge
- Firebase Analytics
- Firebase Crashlytics
- notification permission on Android 13+
- external read/write permission for legacy backup

## Firebase
- `com.google.gms.google-services` plugin applied
- `com.google.firebase.crashlytics` plugin applied
- `android/app/google-services.json` exists locally, but is in `.gitignore`

Implication:
- a new environment cannot build Android with Firebase without this file

## Backup
- uses `react-native-fs` to create folders/files
- generates zip in Android Downloads
- on iOS it generates zip in `DocumentDirectoryPath` and opens share sheet so the user can choose where to save
- restores from `.zip` file chosen by the user
- restored keys are fixed and manually mapped in `restoreBackupToAsyncStorage()`

## Notifications
- handler configured in `App.tsx`
- Android `default` channel created at runtime
- notification click flow does not navigate yet; code is commented

## Deep linking
- configured scheme: `dev.pedropaulo.tjdroid`
- `App.tsx` reads `Linking.getInitialURL()`
- linking configuration lists only `Home` and `Cronometro`

## iOS
- `app.json`/`app.config.js` set `bundleIdentifier` and `buildNumber`
- `yarn ios` script exists
- `GoogleService-Info.plist` is optional; when present at root, `app.config.js` injects `ios.googleServicesFile`
- `ios/` folder does not exist in the current repository; it must be generated via `expo prebuild`/`expo run:ios` on macOS

## Precautions before changing native code
- do not change release signing without understanding the current pipeline
- do not remove `google-services.json` locally
- do not change storage permission without reviewing manual backup
- validate release build if changing Gradle, Firebase, Manifest, notifications, or FS
