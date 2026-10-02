TIB SAP Training Assistant Mobile v2.1 - Password Reset Fix

Production URL:
https://tib-sap-training-assistant-mobile.vercel.app/

Required Supabase Auth URL Configuration:
1. Site URL:
   https://tib-sap-training-assistant-mobile.vercel.app/
2. Redirect URL (exact):
   https://tib-sap-training-assistant-mobile.vercel.app/reset.html

The reset page supports Supabase recovery links and lets the trainee set a new password.
If the exact reset URL is not in Supabase Authentication > URL Configuration > Redirect URLs,
Supabase may ignore redirectTo and send the user to the project's Site URL instead.
