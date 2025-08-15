import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { TransactionType } from "@/src/types/transaction-type";
import { UserCredentials } from "@/src/types/user-credentials";
import { decryptData, deriveKey } from "@/src/utils/encrypt-data";

interface DeleteTransactionProps {
  transaction: TransactionType;
  userSecrets: UserCredentials;
}

export async function deleteTransaction({
  transaction,
  userSecrets,
}: DeleteTransactionProps) {
  const {
    data: { session },
    error: authError,
  } = await supabaseClient.auth.getSession();

  if (authError || !session) throw new Error("Usuário não autenticado");

  const { data, error } = await supabaseClient
    .from("transactions")
    .delete()
    .eq("id", transaction.id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) throw error;

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

  return {
    id: data.id,
    user_id: data.user_id,
    value: decryptData(data.value, keyHex),
    description: decryptData(data.description, keyHex),
    transactionType: decryptData(data.transactionType, keyHex),
    created_at: data.created_at,
  };
}
