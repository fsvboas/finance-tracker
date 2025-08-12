import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface DoLoginProps {
  email: string;
  password: string;
}

export async function doLogin({ email, password }: DoLoginProps) {
  try {
    const { data } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
