export type TransactionType = {
  id: string;
  user_id: string;
  description: string;
  value: string;
  type: "income" | "expense" | "investment";
  created_at: string;
  payment_method?: string;
};
