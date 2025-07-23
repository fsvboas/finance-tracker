export type TransactionType = {
  description: string;
  value: number;
  transactionType: "incoming" | "outcoming";
  date: string;
};
