import { createClient } from "@supabase/supabase-js";

// Public, RLS-protected client — safe to use in the browser.
// Reads only ever see rows where is_active = true (enforced by Postgres RLS
// policies on the products/product_images tables and the collection views).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — catalog data from Supabase will not load."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
