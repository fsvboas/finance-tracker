"use client";

import { Button } from "@/src/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/dialog";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import Column from "@/src/components/utils/column";
import Show from "@/src/components/utils/show";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { doDeleteAccount } from "../services/do-delete-account";

interface DeleteAccountDialogProps {
  trigger: React.ReactNode;
}

const UpdateUserInfosSchema = z.object({
  password: z.string().min(1, "Campo obrigatório"),
});

type UpdateUserInfosFormType = z.infer<typeof UpdateUserInfosSchema>;

const DeleteAccountDialog = ({ trigger }: DeleteAccountDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const { handleSubmit, control, reset } = useForm<UpdateUserInfosFormType>({
    resolver: zodResolver(UpdateUserInfosSchema),
    defaultValues: {
      password: "",
    },
  });

  const { mutate: deleteAccount, isPending: pendingUpdateUserInfos } =
    useMutation({
      mutationFn: doDeleteAccount,
      onSuccess: (data) => {
        toast.success(data.message, {
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

  const handleDeleteAccount = ({ password }: UpdateUserInfosFormType) => {
    deleteAccount({ password });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="overflow-hidden border-b-1 border-black/10">
          <DialogTitle className="overflow-hidden text-ellipsis pb-2">
            Excluir Conta
          </DialogTitle>
        </DialogHeader>
        <Column className="space-y-2">
          <p>
            Ao excluir sua conta na plataforma Finance Tracker, todos os seus
            dados serão removidos do nosso sistema.
          </p>
          {/* <p>
            Recomendamos que faça o backup de seus dados antes da exclusão,
            utilizando o botão &quot;Baixar Planilha&quot;.
          </p> */}
        </Column>
        <form
          id="delete-account-form"
          onSubmit={handleSubmit(handleDeleteAccount)}
          className="space-y-4"
        >
          <Column className="space-y-2">
            <Label htmlFor="oldPassword">
              Senha<span className="text-red-500">*</span>
            </Label>
            <Controller
              name="password"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Column>
          <DialogFooter>
            <Button
              className="cursor-pointer bg-red-500 hover:bg-red-400 duration-300 text-white"
              onClick={() => null}
              disabled={pendingUpdateUserInfos}
            >
              <Show when={pendingUpdateUserInfos} fallback={<Trash2Icon />}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Excluir Conta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
