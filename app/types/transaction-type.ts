export type TransactionType = {
  id: string;
  description: string;
  value: number;
  transactionType: "incoming" | "outcoming";
  date: Date;
};
