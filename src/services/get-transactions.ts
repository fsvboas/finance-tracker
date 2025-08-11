import { api } from "../libs/axios/api";
import { TransactionType } from "../types/transaction-type";

export async function getTransactions() {
  try {
    const { data } = await api.get<TransactionType[]>("/transactions");
    return data;
  } catch (error) {
    throw error;
  }
}
