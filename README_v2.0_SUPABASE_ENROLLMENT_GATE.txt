TIB SAP Training Assistant Mobile v2.0

Adds Supabase trainee sign-in, password recovery, logout and course entitlement filtering.
Uses the same TIB-training-lms authentication and enrollment authority as the Windows app.
Only course IDs returned by get_my_training_assistant_courses() are loaded into the mobile UI after authentication.
The service worker no longer pre-caches courses.json.
No service-role key is present in this package.
