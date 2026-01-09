import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { createClient } from "@/src/libs/supabase/client";
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
  const supabase = createClient();

  const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

  const transactionsToCreate = Array.from(
    { length: repeatMonths },
    (_, index) => {
      const transactionDate = new Date(transaction.created_at);
      transactionDate.setMonth(transactionDate.getMonth() + index);

      return {
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
        card_id: transaction.card_id,
      };
    }
  );

  const { error } = await supabase
    .from("transactions")
    .insert(transactionsToCreate)
    .select();

  if (error) throw error;
}
