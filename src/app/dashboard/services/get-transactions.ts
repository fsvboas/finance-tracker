import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { TransactionType } from "@/src/types/transaction-type";
import { decryptData } from "@/src/utils/encrypt-data";

export async function getTransactions(): Promise<TransactionType[]> {
  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado");
  }

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const decryptedTransactions: TransactionType[] = (data || []).map(
    (transaction: TransactionType) => ({
      id: transaction.id,
      user_id: transaction.user_id,
      description: decryptData(transaction.description, user.id),
      value: decryptData(transaction.value, user.id),
      transactionType: decryptData(transaction.transactionType, user.id) as
        | "incoming"
        | "outcoming",
      created_at: transaction.created_at,
    })
  );

  return decryptedTransactions;
}
