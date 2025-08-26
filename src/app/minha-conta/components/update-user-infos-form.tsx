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
import { Loader2Icon, User } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { doUpdateUserInfos } from "../services/update-user-infos";

const UpdateUserInfosSchema = z.object({
  name: z
    .string()
    .min(3, "Digite um nome válido.")
    .refine((val) => !/^\d+$/.test(val), "O nome não pode ser um número."),
  email: z
    .email("Digite um e-mail válido.")
    .min(1, "O campo e-mail é obrigatório."),
});

type UpdateUserInfosFormType = z.infer<typeof UpdateUserInfosSchema>;

const UpdateUserInfosForm = () => {
  const { user, loading } = useAuth();

  const { handleSubmit, control, reset } = useForm<UpdateUserInfosFormType>({
    resolver: zodResolver(UpdateUserInfosSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { mutate: updateUserInfos, isPending: pendingUpdateUserInfos } =
    useMutation({
      mutationFn: doUpdateUserInfos,
      onSuccess: () => {
        toast.success("Informações alteradas com sucesso!", {
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

  const handleUpdateUserInfos = ({ name, email }: UpdateUserInfosFormType) => {
    updateUserInfos({ name, email });
  };

  useEffect(() => {
    if (user && !loading) {
      reset({
        name: user?.user_metadata?.display_name || "",
        email: user?.email || "",
      });
    }
  }, [user, loading, reset]);

  return (
    <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
      <Row className="items-center space-x-2">
        <User size={20} />
        <h3 className="font-bold">Minhas Informações</h3>
      </Row>
      <form
        id="user-info-form"
        onSubmit={handleSubmit(handleUpdateUserInfos)}
        className="space-y-4"
      >
        <Column className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Column>
            <Controller
              name="name"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="name"
                    value={value}
                    onChange={onChange}
                    className={error ? "border-red-500" : ""}
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
        </Column>
        <Column className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Column>
            <Controller
              name="email"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="email"
                    type="email"
                    value={value}
                    onChange={onChange}
                    className={error ? "border-red-500" : ""}
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
        </Column>
        <Column className="mt-5">
          <Button
            className="hover:cursor-pointer self-end w-full sm:w-[150px]"
            type="submit"
            disabled={pendingUpdateUserInfos}
          >
            <Show when={pendingUpdateUserInfos}>
              <Loader2Icon className="animate-spin" />
            </Show>
            Atualizar Dados
          </Button>
        </Column>
      </form>
    </Column>
  );
};

export default UpdateUserInfosForm;
