import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { TransactionType } from "@/src/types/transaction-type";
import { decryptData, deriveKey } from "@/src/utils/encrypt-data";
import { validateUserPin } from "./user-pin";

interface DeleteTransactionProps {
  transaction: TransactionType;
  pin: string;
}

export async function deleteTransaction({
  transaction,
  pin,
}: DeleteTransactionProps) {
  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) throw new Error("Usuário não autenticado");

  const salt = await validateUserPin({ userId: user.id, pin });

  if (!salt) throw new Error("PIN inválido");

  const { data, error } = await supabaseClient
    .from("transactions")
    .delete()
    .eq("id", transaction.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  const keyHex = deriveKey(pin, salt);

  return {
    id: data.id,
    user_id: data.user_id,
    value: decryptData(data.value, keyHex),
    description: decryptData(data.description, keyHex),
    transactionType: decryptData(data.transactionType, keyHex),
    created_at: data.created_at,
  };
}
