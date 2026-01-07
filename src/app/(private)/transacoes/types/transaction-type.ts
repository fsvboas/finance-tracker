export type TransactionType = {
  id: string;
  description: string;
  value: string;
  type: "income" | "expense" | "investment";
  created_at: string;
  payment_method?: string;
};

export type TransactionRequestType = Omit<TransactionType, "id">;
