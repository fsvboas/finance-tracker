export type TransactionType = {
  id: string;
  user_id: string;
  description: string;
  value: string;
  type: "incoming" | "outcoming";
  created_at: string;
  updated_at?: string;
  payment_method?: string;
};
