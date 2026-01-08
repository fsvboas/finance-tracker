"use server";

import { createServer } from "@/src/libs/supabase/server";

interface DoSignUpProps {
  name: string;
  email: string;
  password: string;
}

export async function doSignUp({ name, email, password }: DoSignUpProps) {
  const supabase = await createServer();

  const { error } = await supabase.auth.signUp({
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

  return { success: true };
}
