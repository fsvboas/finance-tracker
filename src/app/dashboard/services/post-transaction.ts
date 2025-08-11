import { api } from "../../../libs/axios/api";
import { TransactionType } from "../../../types/transaction-type";

interface PostTransactionProps {
  transaction: TransactionType;
}

export async function postTransaction({ transaction }: PostTransactionProps) {
  try {
    const { data } = await api.post("/transactions", transaction);
    return data;
  } catch (error) {
    throw error;
  }
}
