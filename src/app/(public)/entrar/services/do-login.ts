"use server";

import { createServer } from "@/src/libs/supabase/server";

interface DoLoginProps {
  email: string;
  password: string;
}

export async function doLogin({ email, password }: DoLoginProps) {
  const supabase = await createServer();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return { success: true };
}
