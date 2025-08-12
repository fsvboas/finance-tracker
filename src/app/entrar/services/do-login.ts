import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface doLoginProps {
  email: string;
  password: string;
}

export async function doLogin({ email, password }: doLoginProps) {
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
