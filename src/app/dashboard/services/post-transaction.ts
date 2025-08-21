import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { TransactionType } from "@/src/types/transaction-type";
import { UserCredentials } from "@/src/types/user-credentials";
import { deriveKey, encryptData } from "@/src/utils/crypto";

interface PostTransactionProps {
  transaction: TransactionType;
  userSecrets: UserCredentials;
}

export async function postTransaction({
  transaction,
  userSecrets,
}: PostTransactionProps) {
  const {
    data: { session },
    error: authError,
  } = await supabaseClient.auth.getSession();

  if (authError || !session) throw new Error("Usuário não autenticado");

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

  const encryptedTransaction: Partial<TransactionType> = {
    user_id: session.user.id,
    description: encryptData(transaction.description, keyHex),
    value: encryptData(transaction.value, keyHex),
    type: encryptData(transaction.type, keyHex) as
      | "income"
      | "expense"
      | "investment",
    created_at: transaction.created_at,
    payment_method: transaction.payment_method
      ? encryptData(transaction.payment_method, keyHex)
      : undefined,
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
    description: transaction.description,
    value: transaction.value,
    type: transaction.type,
    created_at: transaction.created_at,
    payment_method: transaction.payment_method,
  };
}
