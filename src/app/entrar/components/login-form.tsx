"use client";

import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import Column from "@/src/components/utils/column";
import Show from "@/src/components/utils/show";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { doLogin } from "../services";

const LoginFormSchema = z.object({
  email: z.string().min(1, "O campo email é obrigatório."),
  password: z.string().min(1, "O campo senha é obrigatório."),
});

type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const router = useRouter();

  const { handleSubmit, control } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending: pendingLogin } = useMutation({
    mutationFn: doLogin,
    onSuccess: () => router.push("/dashboard"),
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogin = ({ email, password }: LoginFormSchemaType) => {
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white mx-2">
      <Column className="rounded-xl bg-white p-8 border border-zinc-200 shadow-sm w-[500px]">
        <form
          id="login-form"
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-4"
        >
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
            {/* <Row className="justify-between"> */}
            <Label htmlFor="password">Senha</Label>
            {/* <Button
                type="button"
                variant="link"
                className="p-0 h-fit opacity-40"
                disabled
                onClick={() => null}
              >
                Esqueceu a senha?
              </Button> */}
            {/* </Row> */}
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
          <Column className="mt-5">
            <Button
              className="hover:cursor-pointer w-full"
              type="submit"
              disabled={pendingLogin}
            >
              <Show when={pendingLogin}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Entrar
            </Button>
            <Link
              href="/criar-conta"
              className="flex self-center w-fit"
              passHref
            >
              <Button type="button" variant="link">
                Criar conta
              </Button>
            </Link>
          </Column>
        </form>
      </Column>
    </div>
  );
};

export default LoginForm;
