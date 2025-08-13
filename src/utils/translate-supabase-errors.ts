const errorMessagesTranslation: Record<string, string> = {
  // LOGIN
  "Invalid login credentials": "Credenciais Inválidas.",
  "User not found": "Usuário não encontrado.",
  "Email not confirmed": "O E-mail ainda não foi confirmado.",
  "User is banned":
    "Usuário banido. Caso acredite que foi um erro, entre em contato conosco.",
  // SIGN UP
  "User already registered": "Usuário já registrado.",
  "Signup disabled for this provider":
    "Cadastro desabilitado para este provedor",
  //
};

export function translateSupabaseErrorMessages(msg: string): string {
  return errorMessagesTranslation[msg] || msg;
}
