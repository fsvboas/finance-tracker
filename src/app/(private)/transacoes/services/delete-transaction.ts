import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { createClient } from "@/src/libs/supabase/client";

interface DeleteTransactionProps {
  transaction: TransactionType;
}

export async function deleteTransaction({
  transaction,
}: DeleteTransactionProps) {
  const supabase = createClient();
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transaction.id)
    .select()
    .single();

  if (error) throw error;
}
