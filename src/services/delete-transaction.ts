import { api } from "../libs/axios/api";
import { TransactionType } from "../types/transaction-type";

interface DeleteTransactionProps {
  transactionId: TransactionType["id"];
}

export async function deleteTransaction({
  transactionId,
}: DeleteTransactionProps) {
  try {
    const { data } = await api.delete(`/transactions/${transactionId}`);
    return data;
  } catch (error) {
    throw error;
  }
}
