"use client";

import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { useAuth } from "@/src/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Database,
  Download,
  Loader2Icon,
  LockKeyhole,
  User,
  UserRoundX,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { doUpdatePassword } from "../services/update-password";

const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmNewPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

type ChangePasswordFormType = z.infer<typeof ChangePasswordSchema>;

const UpdateUserForm = () => {
  const { user } = useAuth();

  const { handleSubmit, control, reset } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mutate: updatePassword, isPending: pendingChangePassword } =
    useMutation({
      mutationFn: doUpdatePassword,
      onSuccess: () => {
        toast.success("Senha alterada com sucesso!", {
          className: "!bg-green-600/80 !text-white",
        });
        reset();
      },
      onError: (error: Error) => {
        toast.error(error.message, {
          className: "!bg-red-600/80 !text-white",
        });
      },
    });

  const handleChangePassword = ({
    oldPassword,
    newPassword,
  }: ChangePasswordFormType) => {
    updatePassword({ oldPassword, newPassword });
  };

  return (
    <Column className="items-center h-fit w-full space-y-2 sm:max-w-5xl mx-auto mt-16 lg:py-4">
      <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
        <Row className="items-center space-x-2">
          <User size={20} />
          <h3 className="font-bold">Minhas Informações</h3>
        </Row>
        <form id="user-info-form" className="space-y-4">
          <Column className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Column>
              <Input
                id="name"
                value={user?.user_metadata?.display_name ?? ""}
                disabled
              />
              <div className="h-2 -mt-1" />
            </Column>
          </Column>
          <Column className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Column>
              <Input id="email" value={user?.email ?? ""} disabled />
              <div className="h-2 -mt-1" />
            </Column>
          </Column>
        </form>
      </Column>
      <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
        <Row className="items-center space-x-2">
          <LockKeyhole size={20} />
          <h3 className="font-bold">Trocar Senha</h3>
        </Row>
        <form
          id="user-credentials-form"
          className="space-y-4"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <Column className="space-y-2">
            <Label htmlFor="oldPassword">Senha Atual</Label>
            <Controller
              name="oldPassword"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="oldPassword"
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
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Controller
              name="newPassword"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="newPassword"
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
            <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="confirmNewPassword"
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
              className="hover:cursor-pointer self-end w-full sm:w-[150px]"
              type="submit"
              disabled={pendingChangePassword}
            >
              <Show when={pendingChangePassword}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Trocar Senha
            </Button>
          </Column>
        </form>
      </Column>
      <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
        <Row className="items-center space-x-2">
          <Database size={20} />
          <h3 className="font-bold">Meus Dados</h3>
        </Row>
        <dl className="space-y-2">
          <Row className="space-x-2 items-center justify-between">
            <dt className="text-sm hidden sm:block">Exportar Dados</dt>
            <dd className="w-full sm:w-[150px]">
              <Button
                disabled
                className="cursor-pointer bg-green-600 hover:bg-green-500 duration-300 text-white w-full"
              >
                <Show when={false} fallback={<Download />}>
                  <Loader2Icon className="animate-spin" />
                </Show>
                Baixar Planilha
              </Button>
            </dd>
          </Row>
          <Row className="space-x-2 items-center justify-between">
            <dt className="text-sm hidden sm:block">
              Não quer mais utilizar o Finance Tracker?
            </dt>
            <dd className="w-full sm:w-[150px]">
              <Button
                disabled
                className="cursor-pointer bg-red-500 hover:bg-red-400 duration-300 text-white w-full"
              >
                <Show when={false} fallback={<UserRoundX />}>
                  <Loader2Icon className="animate-spin" />
                </Show>
                Excluir Conta
              </Button>
            </dd>
          </Row>
        </dl>
      </Column>
    </Column>
  );
};

export default UpdateUserForm;
