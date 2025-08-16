import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { UserCredentials } from "@/src/types/user-credentials";
import { decryptData, deriveKey } from "@/src/utils/encrypt-data";
import NProgress from "nprogress";

interface GetTransactionsProps {
  userSecrets: UserCredentials;
}

export async function getTransactions({ userSecrets }: GetTransactionsProps) {
  NProgress.start();

  const result = (async () => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session) throw new Error("Usuário não autenticado");

    const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

    const { data, error } = await supabaseClient
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((transaction) => ({
      ...transaction,
      description: decryptData(transaction.description, keyHex),
      value: decryptData(transaction.value, keyHex),
      type: decryptData(transaction.type, keyHex),
      created_at: transaction.created_at,
      payment_method: transaction.payment_method
        ? decryptData(transaction.payment_method, keyHex)
        : undefined,
    }));
  })();

  return result.finally(() => {
    NProgress.done();
  });
}
