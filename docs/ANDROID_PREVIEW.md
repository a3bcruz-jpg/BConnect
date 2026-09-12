# BConnect Android Preview

BConnect uses the existing Next.js application inside a Capacitor Android shell. The web application and Supabase backend remain unchanged.

## Prerequisites

- Node.js 20+
- Android Studio
- Android SDK and an Android emulator or USB-debuggable Android phone
- Java 17+

## Install Capacitor dependencies

```bash
npm install
```

## Create the Android project

```bash
npx cap add android
```

The generated `android/` directory is native build output and should be committed after verifying the project opens successfully in Android Studio.

## Preview the deployed BConnect app

Set `CAPACITOR_SERVER_URL` to the HTTPS BConnect deployment you want to preview, then run:

```bash
npx cap sync android
npx cap open android
```

For example, in PowerShell:

```powershell
$env:CAPACITOR_SERVER_URL='https://YOUR-BCONNECT-PREVIEW.vercel.app'
npx cap sync android
npx cap open android
```

Do not commit secrets into this variable or into the repository.

## Test checklist

1. Launch the Android app.
2. Confirm BConnect landing page loads.
3. Sign in with a test account.
4. Confirm role routing works.
5. Resident: open Report Incident and verify browser location permission behavior.
6. Resident: submit a test incident and verify tracking.
7. Official: verify the incident appears in the queue.
8. Official: assign an active responder.
9. Responder: confirm the assignment appears and test status transitions.
10. Responder: test Available, Busy, and Offline availability.
11. Confirm no unauthorized role can modify another role's restricted actions.
12. Test Android back navigation and keyboard behavior.

## Important architecture rule

Do not embed a Next.js server in the APK. The current preview uses the deployed BConnect web application and its existing Vercel/Supabase services. A later production packaging phase can evaluate static asset packaging if the Next.js server/API/SSR requirements permit it.
