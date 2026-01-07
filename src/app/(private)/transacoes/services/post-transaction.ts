import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import { UserCredentials } from "@/src/types/user-credentials";
import { deriveKey, encryptData } from "@/src/utils/crypto";

interface PostTransactionProps {
  transaction: TransactionType;
  userSecrets: UserCredentials;
  repeatMonths?: number;
}

export async function postTransaction({
  transaction,
  userSecrets,
  repeatMonths = 1,
}: PostTransactionProps) {
  const {
    data: { session },
    error: authError,
  } = await supabaseClient.auth.getSession();

  if (authError || !session) throw new Error("Usuário não autenticado");

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

  const transactionsToCreate = Array.from(
    { length: repeatMonths },
    (_, index) => {
      const transactionDate = new Date(transaction.created_at);
      transactionDate.setMonth(transactionDate.getMonth() + index);

      return {
        user_id: session.user.id,
        description: encryptData(transaction.description, keyHex),
        value: encryptData(transaction.value, keyHex),
        type: encryptData(transaction.type, keyHex) as
          | "income"
          | "expense"
          | "investment",
        created_at: transactionDate.toISOString(),
        payment_method: transaction.payment_method
          ? encryptData(transaction.payment_method, keyHex)
          : undefined,
      };
    }
  );

  const { data, error } = await supabaseClient
    .from("transactions")
    .insert(transactionsToCreate)
    .select();

  if (error) throw error;

  const decryptedTransactions = data.map((item, index) => {
    const transactionDate = new Date(transaction.created_at);
    transactionDate.setMonth(transactionDate.getMonth() + index);

    return {
      id: item.id,
      user_id: item.user_id,
      description: transaction.description,
      value: transaction.value,
      type: transaction.type,
      created_at: transactionDate.toISOString(),
      payment_method: transaction.payment_method,
    };
  });

  return decryptedTransactions;
}
