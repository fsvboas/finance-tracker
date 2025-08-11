export type TransactionType = {
  id: string;
  description: string;
  value: string;
  transactionType: "incoming" | "outcoming";
  date: Date;
};
