export type TransactionType = {
  id: string;
  user_id: string;
  description: string;
  value: string;
  transactionType: "incoming" | "outcoming";
  created_at: string;
};
