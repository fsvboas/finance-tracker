import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { createClient } from "@/src/libs/supabase/client";

interface DeleteCardProps {
  card: CardType;
}

export async function deleteCard({ card }: DeleteCardProps) {
  const supabase = createClient();

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", card.id)
    .select()
    .single();

  if (error) throw error;

  return;
}
