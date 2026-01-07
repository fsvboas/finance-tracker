import { CardRequestType } from "@/src/app/(private)/cartoes/types/card-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface PostCardProps {
  card: CardRequestType;
}

export async function postCard({ card }: PostCardProps) {
  const {
    data: { session },
    error: authError,
  } = await supabaseClient.auth.getSession();

  if (authError || !session) throw new Error("Usuário não autenticado");

  const { data, error } = await supabaseClient
    .from("cards")
    .insert([
      {
        user_id: session.user.id,
        card_name: card.cardName,
        card_type: card.cardType,
        card_limit: card.cardLimit,
        card_due_date: card.cardDueDate,
        card_color: card.cardColor,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data;
}
