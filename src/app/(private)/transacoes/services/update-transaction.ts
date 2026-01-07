import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { UserCredentials } from "@/src/types/user-credentials";
import { deriveKey, encryptData } from "@/src/utils/crypto";

interface UpdateTransactionProps {
  transactionId: TransactionType["id"];
  transaction: Omit<TransactionType, "id" | "user_id">;
  userSecrets: UserCredentials;
}

export async function updateTransaction({
  transactionId,
  transaction,
  userSecrets,
}: UpdateTransactionProps) {
  const {
    data: { session },
    error: authError,
  } = await supabaseClient.auth.getSession();

  if (authError || !session) throw new Error("Usuário não autenticado");

  const { data: existingTransaction, error: fetchError } = await supabaseClient
    .from("transactions")
    .select("id, user_id")
    .eq("id", transactionId)
    .eq("user_id", session.user.id)
    .single();

  if (fetchError || !existingTransaction) {
    throw new Error("Transação não encontrada.");
  }

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

  const encryptedTransaction: Partial<TransactionType> = {
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
    .update(encryptedTransaction)
    .eq("id", transactionId)
    .eq("user_id", session.user.id)
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
