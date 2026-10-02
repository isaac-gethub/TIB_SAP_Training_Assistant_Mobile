TIB SAP TRAINING ASSISTANT — MOBILE EDITION
PUBLISH-READY PWA PACKAGE

PURPOSE
This package is the mobile companion to the TIB Windows SAP Training Assistant.
SAP remains on the trainee's Windows PC. The mobile app runs on the trainee's phone/tablet.

TRAINEE SEQUENCE
1. Open SAP Logon / SAP GUI on the Windows PC.
2. Log in to the SAP training system assigned by the instructor.
3. Keep SAP open.
4. Open the HTTPS address where this Mobile Edition is published.
5. Optional: install/add the app to the phone Home Screen.
6. Select Course -> Module/Week -> Lab.
7. Follow READ -> LISTEN -> SHOW ME -> DO IN SAP -> CONFIRM -> NEXT.

PUBLISHING
Upload ALL files in this folder together to the root of an HTTPS-enabled static website.
Do not upload only index.html: courses.json, app.js, style.css, manifest, service worker, and icons are required.

IMPORTANT
The package intentionally contains NO hard-coded public URL, QR code, trainee password, or fake login.
After TIB chooses the final HTTPS address, that real address can be placed in trainee instructions and converted into a QR code.

INSTALL ON IPHONE/IPAD
Open the published HTTPS address in Safari -> Share -> Add to Home Screen -> Add.

INSTALL ON ANDROID
Open the published HTTPS address in Chrome -> browser menu -> Install app / Add to Home screen.

OFFLINE USE
After the published app has loaded successfully at least once, the service worker caches the core application and course library for later use. Browser/device storage policies can still clear cached data.
