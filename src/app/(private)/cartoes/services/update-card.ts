import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { createClient } from "@/src/libs/supabase/client";

interface UpdateTransactionProps {
  card: CardType;
}

export async function updateCard({ card }: UpdateTransactionProps) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cards")
    .update({
      name: card.name,
      type: card.type,
      credit_limit: card.creditLimit,
      due_date: card.dueDate,
      color: card.color,
    })
    .eq("id", card.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
