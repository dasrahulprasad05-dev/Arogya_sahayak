-- ====================================================================
-- AROGYA SAHAYAK: DELETE USER & CONFIGURE ADMIN ACCOUNT
-- Execute this script in your Supabase Dashboard -> SQL Editor
-- (https://supabase.com/dashboard/project/reoskksryeqgehisaaho/sql)
-- ====================================================================

-- Step 1: Cleanly delete the existing user with email 'rahulprasadcoding01@gmail.com'
-- This deletes from auth.users and automatically cascades to profiles, health_logs, etc.
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = 'rahulprasadcoding01@gmail.com';
  
  IF v_user_id IS NOT NULL THEN
    -- Clean up any related child records
    DELETE FROM public.admin_users WHERE user_id = v_user_id;
    DELETE FROM public.doctors WHERE id = v_user_id;
    DELETE FROM public.health_logs WHERE user_id = v_user_id;
    DELETE FROM public.profiles WHERE id = v_user_id;
    
    -- Delete the user from auth.users
    DELETE FROM auth.users WHERE id = v_user_id;
    
    RAISE NOTICE 'SUCCESS: User with email rahulprasadcoding01@gmail.com (ID: %) was completely deleted.', v_user_id;
  ELSE
    RAISE NOTICE 'INFO: No existing user found with email rahulprasadcoding01@gmail.com.';
  END IF;
END $$;


-- ====================================================================
-- HOW TO RE-CREATE AS A DEDICATED ADMIN:
-- 1. In Supabase Dashboard -> Authentication -> Users:
--    Click "Add user" -> "Create user"
--    Email: rahulprasadcoding01@gmail.com
--    Password: <choose a strong admin password>
--    Auto-confirm user: CHECKED (Yes)
--
-- 2. Then run the following SQL to grant Admin rights:
--
--    INSERT INTO public.admin_users (user_id, role)
--    SELECT id, 'admin'
--    FROM auth.users
--    WHERE lower(email) = 'rahulprasadcoding01@gmail.com'
--    ON CONFLICT (user_id) DO NOTHING;
--
-- 3. You can then log in exclusively via: /admin-login
-- ====================================================================

