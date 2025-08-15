import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { TransactionType } from "@/src/types/transaction-type";
import { UserCredentials } from "@/src/types/user-credentials";
import { deriveKey, encryptData } from "@/src/utils/encrypt-data";

interface PostTransactionProps {
  transaction: TransactionType;
  userSecrets: UserCredentials;
}

export async function postTransaction({
  transaction,
  userSecrets,
}: PostTransactionProps) {
  // TO-DO: USE ACCESS TOKEN INSTEAD CALL THE GET USER IN EVERY REQUEST
  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) throw new Error("Usuário não autenticado");

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt);

  const encryptedTransaction: Partial<TransactionType> = {
    user_id: user.id,
    description: encryptData(transaction.description, keyHex),
    value: encryptData(transaction.value, keyHex),
    transactionType: encryptData(transaction.transactionType, keyHex) as
      | "incoming"
      | "outcoming",
  };

  const { data, error } = await supabaseClient
    .from("transactions")
    .insert([encryptedTransaction])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    user_id: data.user_id,
    value: transaction.value,
    description: transaction.description,
    transactionType: transaction.transactionType,
    created_at: data.created_at,
  };
}
