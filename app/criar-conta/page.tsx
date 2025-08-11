"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Column from "../components/utils/column";
import Show from "../components/utils/show";

const RegisterFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Digite um nome válido (mínimo 3 caracteres).")
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

export default function RegisterScreen() {
  const { handleSubmit, control } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = (login: RegisterFormSchemaType) => {
    console.log(login);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white mx-2">
      <Column className="rounded-xl bg-white p-8 border border-zinc-200 shadow-sm w-[500px]">
        <form
          id="login-form"
          onSubmit={handleSubmit(handleRegister)}
          className="space-y-4"
        >
          <Column className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Controller
              name="name"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
              // disabled={pendingRegister}
            >
              {/* <Show when={pendingRegister}> */}
              {/* <Loader2Icon className="animate-spin" /> */}
              {/* </Show> */}
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
    </div>
  );
}
