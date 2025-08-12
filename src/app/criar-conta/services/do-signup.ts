import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface DoSignUpProps {
  name: string;
  email: string;
  password: string;
}

export async function doSignUp({ name, email, password }: DoSignUpProps) {
  try {
    await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
