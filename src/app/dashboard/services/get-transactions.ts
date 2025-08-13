import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { decryptData, deriveKey } from "@/src/utils/encrypt-data";

export async function getTransactions(pin: string) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data: userSecret } = await supabaseClient
    .from("user_secrets")
    .select("salt")
    .eq("user_id", user.id)
    .single();

  if (!userSecret?.salt) throw new Error("PIN não configurado");

  const keyHex = deriveKey(pin, userSecret.salt);

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
