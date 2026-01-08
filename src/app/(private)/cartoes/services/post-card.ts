import { CardRequestType } from "@/src/app/(private)/cartoes/types/card-type";
import { createClient } from "@/src/libs/supabase/client";

interface PostCardProps {
  card: CardRequestType;
}

export async function postCard({ card }: PostCardProps) {
  const supabase = createClient();

  const { error } = await supabase
    .from("cards")
    .insert([
      {
        name: card.name,
        type: card.type,
        credit_limit: card.creditLimit,
        due_date: card.dueDate,
        color: card.color,
      },
    ])
    .select();

  if (error) throw error;

  return;
}
