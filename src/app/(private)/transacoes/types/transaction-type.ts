import { CardType } from "@/src/app/(private)/cartoes/types/card-type";

export interface TransactionType {
  id?: string;
  description: string;
  value: string;
  type: "income" | "expense" | "investment";
  created_at: string;
  payment_method?: string;
  card_id?: string;
  user_id?: string;
  cards?: CardType;
}

export type TransactionRequestType = Omit<TransactionType, "id">;
