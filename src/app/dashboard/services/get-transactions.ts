import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { UserCredentials } from "@/src/types/user-credentials";
import { decryptData, deriveKey } from "@/src/utils/encrypt-data";

interface GetTransactionsProps {
  userSecrets: UserCredentials;
}

export async function getTransactions({ userSecrets }: GetTransactionsProps) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((tx) => ({
    ...tx,
    description: decryptData(tx.description, keyHex),
    value: decryptData(tx.value, keyHex),
    transactionType: decryptData(tx.transactionType, keyHex),
  }));
}
