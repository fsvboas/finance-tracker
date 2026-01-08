import { createClient } from "@/src/libs/supabase/client";

interface DoUpdatePasswordProps {
  oldPassword: string;
  newPassword: string;
}

export async function doUpdatePassword({
  oldPassword,
  newPassword,
}: DoUpdatePasswordProps) {
  const supabase = createClient();

  if (oldPassword === newPassword)
    throw new Error("A nova senha deve ser diferente da senha atual");

  const { data: user } = await supabase.auth.getUser();

  if (!user.user?.email) throw new Error("Usuário não encontrado");

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.user.email,
    password: oldPassword,
  });

  if (signInError) throw new Error("A senha atual inserida está incorreta");

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) throw updateError;

  return;
}
