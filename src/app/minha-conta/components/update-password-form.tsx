"use client";

import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, LockKeyhole } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { doUpdatePassword } from "../services/update-password";

const UpdatePasswordSchema = z
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

type UpdatePasswordFormType = z.infer<typeof UpdatePasswordSchema>;

const UpdatePasswordForm = () => {
  const { handleSubmit, control, reset, watch } =
    useForm<UpdatePasswordFormType>({
      resolver: zodResolver(UpdatePasswordSchema),
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
  }: UpdatePasswordFormType) => {
    updatePassword({ oldPassword, newPassword });
  };

  const { oldPassword, newPassword, confirmNewPassword } = watch();
  const formInputFieldIsBlank = [
    oldPassword,
    newPassword,
    confirmNewPassword,
  ].some((value) => value === "");

  return (
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="oldPassword"
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="newPassword"
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Column>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="newPassword"
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
            disabled={pendingChangePassword || formInputFieldIsBlank}
          >
            <Show when={pendingChangePassword}>
              <Loader2Icon className="animate-spin" />
            </Show>
            Trocar Senha
          </Button>
        </Column>
      </form>
    </Column>
  );
};

export default UpdatePasswordForm;
