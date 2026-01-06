import { supabaseClient } from "@/src/libs/supabase/supabase-client";

interface DoUpdateUserInfosProps {
  name: string;
  email: string;
}

export async function doUpdateUserInfos({
  name,
  email,
}: DoUpdateUserInfosProps) {
  const { error: updateError } = await supabaseClient.auth.updateUser({
    data: {
      display_name: name,
    },
    email,
  });

  if (updateError) throw updateError;

  return;
}
