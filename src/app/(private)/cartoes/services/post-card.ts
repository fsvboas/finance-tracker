import { CardRequestType } from "@/src/app/(private)/cartoes/types/card-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface PostCardProps {
  card: CardRequestType;
}

export async function postCard({ card }: PostCardProps) {
  const { error } = await supabaseClient
    .from("cards")
    .insert([
      {
        name: card.name,
        type: card.type,
        limit: card.creditLimit,
        due_date: card.dueDate,
        color: card.color,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return;
}
