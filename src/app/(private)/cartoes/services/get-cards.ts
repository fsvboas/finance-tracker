import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { createClient } from "@/src/libs/supabase/client";
import camelcaseKeys from "camelcase-keys";

export async function getCards(): Promise<CardType[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("cards").select("*");

  if (error) throw error;

  return camelcaseKeys(data || []);
}
