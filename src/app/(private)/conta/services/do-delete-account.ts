import { createClient } from "@/src/libs/supabase/client";

interface DoDeleteAccountProps {
  password: string;
}

export async function doDeleteAccount({ password }: DoDeleteAccountProps) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user?.email) throw new Error("Usuário não encontrado");

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.user.email,
    password,
  });

  if (signInError) throw new Error("Senha incorreta");

  const { error: deleteError } = await supabase.rpc("delete_current_user");

  if (deleteError)
    throw new Error(`Erro ao deletar conta: ${deleteError.message}`);

  await supabase.auth.signOut();

  return { success: true, message: "Conta excluída com sucesso!" };
}
