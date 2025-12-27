import { supabaseClient } from "@/src/libs/supabase/supabase-client";

export async function doLogout() {
  try {
    await supabaseClient.auth.signOut();
  } catch (error) {
    throw error;
  }
}
