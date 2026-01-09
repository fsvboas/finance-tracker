import { createClient } from "@/src/libs/supabase/client";
import { UserCredentials } from "@/src/types/user-credentials";
import { decryptData, deriveKey } from "@/src/utils/crypto";

interface GetTransactionsProps {
  userSecrets: UserCredentials;
  cardId?: string;
}

export async function getTransactions({
  userSecrets,
  cardId,
}: GetTransactionsProps) {
  const supabase = createClient();

  const result = (async () => {
    const keyHex = deriveKey(userSecrets.pin, userSecrets.salt!);

    let query = supabase.from("transactions").select(`
        *,
        cards (
          id,
          name,
          color,
          type,
          credit_limit
        )
      `);

    if (cardId) {
      query = query.eq("card_id", cardId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

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
      cards: transaction.cards,
    }));
  })();

  return result;
}
