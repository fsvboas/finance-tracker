import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { TransactionType } from "@/src/types/transaction-type";

export async function getTransactions(): Promise<TransactionType[]> {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}
