import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface DoSignUpProps {
  name: string;
  email: string;
  password: string;
}

export async function doSignUp({ name, email, password }: DoSignUpProps) {
  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return;
}
