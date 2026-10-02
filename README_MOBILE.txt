TIB SAP TRAINING ASSISTANT — MOBILE PWA PROTOTYPE

PURPOSE
Phone/tablet companion used beside SAP GUI running on the trainee's Windows PC.

STARTUP SEQUENCE
1. On PC: Open SAP GUI and log in to the assigned training system.
2. Keep SAP open.
3. On phone/tablet: Open the TIB Mobile Training Assistant URL.
4. Select Course -> Module/Week -> Lab.
5. Use READ -> LISTEN -> SHOW ME -> DO IN SAP -> CONFIRM -> NEXT.

DEPLOYMENT
This folder is a static Progressive Web App. Upload the entire folder to any HTTPS static web host. Do not open index.html directly from a ZIP. HTTPS is required for install/offline service-worker behavior.

INSTALL ON PHONE
iPhone/iPad: Open the site in Safari -> Share -> Add to Home Screen.
Android: Open the site in Chrome -> Install app / Add to Home screen.

CONTENT
The package contains the same three-course JSON content used by the current TIB Windows training build.

NOTE
LISTEN uses the phone/browser speech engine to speak the supplied narration text. SHOW ME is a navigation guide derived from the loaded course content. The mobile app does not connect to, control, inspect, or log in to SAP.
