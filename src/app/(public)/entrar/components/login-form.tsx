"use client";

import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import { Input } from "@/src/components/core/input";
import { Label } from "@/src/components/core/label";
import Show from "@/src/components/core/show";
import { supabaseErrorsTranslator } from "@/src/utils/translate-supabase-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "@supabase/supabase-js";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { doLogin } from "../services";

const LoginFormSchema = z.object({
  email: z.string().min(1, "O campo email é obrigatório."),
  password: z.string().min(1, "O campo senha é obrigatório."),
});

type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { handleSubmit, control, watch } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = ({ email, password }: LoginFormSchemaType) => {
    startTransition(async () => {
      try {
        await doLogin({ email, password });
        router.push("/transacoes");
        router.refresh();
      } catch (error) {
        toast.error(
          supabaseErrorsTranslator(error as AuthError) ||
            "Erro ao realizar login. Tente novamente mais tarde.",
          {
            className: "!bg-red-600 !text-white",
          }
        );
      }
    });
  };

  const { email, password } = watch();
  const formInputFieldIsBlank = [email, password].some((value) => value === "");

  return (
    <Column className="rounded-lg p-6 border shadow-sm max-w-125 w-full">
      <form
        id="login-form"
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-4"
      >
        <Column className="space-y-2">
          <Label htmlFor="email">
            E-mail<span className="text-red-500">*</span>
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="email"
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  value={value}
                  onChange={onChange}
                  className={`${error && "border-red-600"}`}
                />
                <div className="h-2 -mt-1">
                  <Show when={error}>
                    <span className="text-xs text-red-600">
                      {error?.message}
                    </span>
                  </Show>
                </div>
              </Column>
            )}
          />
        </Column>
        <Column className="space-y-2">
          <Label htmlFor="password">
            Senha<span className="text-red-500">*</span>
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={value}
                  onChange={onChange}
                  className={`${error && "border-red-600"}`}
                />
                <div className="h-2 -mt-1">
                  <Show when={error}>
                    <span className="text-xs text-red-600">
                      {error?.message}
                    </span>
                  </Show>
                </div>
              </Column>
            )}
          />
        </Column>
        <Column className="mt-5">
          <Button
            className="hover:cursor-pointer w-full"
            type="submit"
            disabled={isPending || formInputFieldIsBlank}
          >
            <Show when={isPending}>
              <Loader2Icon className="animate-spin" />
            </Show>
            Entrar
          </Button>
          <Link href="/cadastro" className="flex self-center w-fit" passHref>
            <Button type="button" variant="link">
              Criar conta
            </Button>
          </Link>
        </Column>
      </form>
    </Column>
  );
};

export default LoginForm;
