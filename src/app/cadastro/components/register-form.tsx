"use client";

import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import Column from "@/src/components/utils/column";
import Show from "@/src/components/utils/show";
import { translateSupabaseErrorMessages } from "@/src/utils/translate-supabase-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { doSignUp } from "../services/do-signup";

const RegisterFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Digite um nome válido.")
      .refine((val) => !/^\d+$/.test(val), "O nome não pode ser um número."),
    email: z
      .email("Digite um e-mail válido.")
      .min(1, "O campo e-mail é obrigatório."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;

const RegisterForm = () => {
  const router = useRouter();

  const { handleSubmit, control } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: signUp, isPending: pendingSignUp } = useMutation({
    mutationFn: doSignUp,
    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso!", {
        className: "!bg-green-600/80 !text-white",
      });
      router.push("/entrar");
    },
    onError: (error) => {
      const message = translateSupabaseErrorMessages(error.message);
      toast.error(message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleSignUp = ({ name, email, password }: RegisterFormSchemaType) => {
    signUp({ name, email, password });
  };

  return (
    <Column className="rounded-lg bg-white p-6 border border-zinc-200 shadow-sm w-full max-w-[500px]">
      <form
        id="login-form"
        onSubmit={handleSubmit(handleSignUp)}
        className="space-y-4"
      >
        <Column className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="name"
                  placeholder="Seu nome"
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
          <Label htmlFor="email">E-mail</Label>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="email"
                  placeholder="seuemail@exemplo.com"
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
          <Label htmlFor="password">Senha</Label>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
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
            disabled={pendingSignUp}
          >
            <Show when={pendingSignUp}>
              <Loader2Icon className="animate-spin" />
            </Show>
            Criar conta
          </Button>
          <Link href="/entrar" className="flex self-center w-fit" passHref>
            <Button type="button" variant="link">
              Já tenho uma conta
            </Button>
          </Link>
        </Column>
      </form>
    </Column>
  );
};

export default RegisterForm;
