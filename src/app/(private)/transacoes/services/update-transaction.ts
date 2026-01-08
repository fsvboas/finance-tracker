import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { createClient } from "@/src/libs/supabase/client";
import { UserCredentials } from "@/src/types/user-credentials";
import { deriveKey, encryptData } from "@/src/utils/crypto";

interface UpdateTransactionProps {
  transaction: TransactionType;
  userSecrets: UserCredentials;
}

export async function updateTransaction({
  transaction,
  userSecrets,
}: UpdateTransactionProps) {
  const supabase = createClient();

  const { data, error: fetchError } = await supabase
    .from("transactions")
    .select("id")
    .eq("id", transaction.id)
    .single();

  if (!data || fetchError) {
    throw new Error("Transação não encontrada. Tente novamente mais tarde.");
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

  const { error } = await supabase
    .from("transactions")
    .update(encryptedTransaction)
    .eq("id", transaction.id)
    .select()
    .single();

  if (error) throw error;

  return;
}
