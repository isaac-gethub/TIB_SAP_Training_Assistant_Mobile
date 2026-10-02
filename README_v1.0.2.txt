TIB SAP Training Assistant Mobile v1.0.2
INSTALLATION EXPERIENCE PATCH

Preserved from v1.0.1:
- LISTEN / PAUSE / RESUME / STOP
- automatic speech cancellation on navigation/backgrounding
- all packaged course content

New in v1.0.2:
- Android/compatible Chromium: explicit INSTALL TIB APP button appears when the browser reports the PWA is installable.
- Installed/standalone mode: shows TIB APP INSTALLED.
- iPhone/iPad: shows Share -> Add to Home Screen instructions.
- Cache version bumped to v1.0.2.

IMPORTANT:
Browsers control whether the native PWA install prompt is available. The app cannot force an install prompt before the browser's installability event fires.

Deploy the CONTENTS of this folder to the existing Vercel project:
tib-sap-training-assistant-mobile

Production URL:
https://tib-sap-training-assistant-mobile.vercel.app/
