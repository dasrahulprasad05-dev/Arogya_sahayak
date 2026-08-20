// ──────────────────────────────────────────
// Shared Auth Helper — JWT Validation for Edge Functions
// Replaces the insecure `authHeader.substring(7)` pattern
// ──────────────────────────────────────────

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

/**
 * Extract and validate the user ID from a Supabase JWT token.
 * Returns the authenticated user ID, or "anonymous" if the token is
 * missing/invalid. This replaces the old `authHeader.substring(7)` pattern
 * which never actually validated the JWT.
 */
export async function getAuthUserId(req: Request): Promise<string> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return "anonymous";
  }

  try {
    const token = authHeader.substring(7);
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.warn("[Auth] JWT validation failed:", error?.message || "No user");
      return "anonymous";
    }

    return user.id;
  } catch (err: any) {
    console.warn("[Auth] JWT validation error:", err.message);
    return "anonymous";
  }
}
