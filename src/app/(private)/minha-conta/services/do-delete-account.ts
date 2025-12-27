import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface DoDeleteAccountProps {
  password: string;
}

export async function doDeleteAccount({ password }: DoDeleteAccountProps) {
  const { data: user } = await supabaseClient.auth.getUser();

  if (!user.user?.email) throw new Error("Usuário não encontrado");

  const { error: signInError } = await supabaseClient.auth.signInWithPassword({
    email: user.user.email,
    password,
  });

  if (signInError) throw new Error("Senha incorreta");

  const { error: deleteError } = await supabaseClient.rpc(
    "delete_current_user"
  );

  if (deleteError)
    throw new Error(`Erro ao deletar conta: ${deleteError.message}`);

  await supabaseClient.auth.signOut();

  return { success: true, message: "Conta excluída com sucesso!" };
}
