import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";

export async function getCards(): Promise<CardType[]> {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) throw new Error("Usuário não autenticado");

  const { data, error } = await supabaseClient.from("cards").select("*");

  if (error) throw error;

  return data || [];
}
