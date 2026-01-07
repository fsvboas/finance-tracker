import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface DeleteCardProps {
  card: CardType;
}

export async function deleteCard({ card }: DeleteCardProps) {
  const {
    data: { session },
    error: authError,
  } = await supabaseClient.auth.getSession();

  if (authError || !session) throw new Error("Usuário não autenticado");

  const { data, error } = await supabaseClient
    .from("cards")
    .delete()
    .eq("id", card.id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) throw error;

  if (error) throw new Error(error);

  return data;
}
