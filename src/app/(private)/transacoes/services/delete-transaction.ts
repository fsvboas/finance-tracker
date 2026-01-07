import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { UserCredentials } from "@/src/types/user-credentials";
import { decryptData, deriveKey } from "@/src/utils/crypto";

interface DeleteTransactionProps {
  transaction: TransactionType;
  userSecrets: UserCredentials;
}

export async function deleteTransaction({
  transaction,
  userSecrets,
}: DeleteTransactionProps) {
  const { data, error } = await supabaseClient
    .from("transactions")
    .delete()
    .eq("id", transaction.id)
    .select()
    .single();

  if (error) throw error;

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

  return {
    id: data.id,
    user_id: data.user_id,
    value: decryptData(data.value, keyHex),
    description: decryptData(data.description, keyHex),
    type: decryptData(data.type, keyHex),
    created_at: data.created_at,
  };
}
