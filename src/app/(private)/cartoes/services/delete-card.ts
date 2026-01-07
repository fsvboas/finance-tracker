import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface DeleteCardProps {
  card: CardType;
}

export async function deleteCard({ card }: DeleteCardProps) {
  const { error } = await supabaseClient
    .from("cards")
    .delete()
    .eq("id", card.id)
    .select()
    .single();

  if (error) throw error;

  return;
}
