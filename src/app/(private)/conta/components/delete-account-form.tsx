import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import { Input } from "@/src/components/core/input";
import { Label } from "@/src/components/core/label";
import Show from "@/src/components/core/show";
import { useMediaQuery } from "@/src/hooks/use-media-query";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, UserRoundX } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { doDeleteAccount } from "../services/do-delete-account";

const DeleteAccountFormSchema = z.object({
  password: z.string().min(1, "Campo obrigatório"),
});

type DeleteAccountFormType = z.infer<typeof DeleteAccountFormSchema>;

const DeleteAccountForm = () => {
  const { clearCredentials } = useUserSecrets();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { handleSubmit, control, watch } = useForm<DeleteAccountFormType>({
    resolver: zodResolver(DeleteAccountFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const { mutate: deleteAccount, isPending: pendingUpdateUserInfos } =
    useMutation({
      mutationFn: doDeleteAccount,
      onSuccess: (data) => {
        clearCredentials();
        toast.success(data.message, {
          className: "!bg-green-600/80 !text-white",
        });
      },
      onError: (error: Error) => {
        toast.error(error.message, {
          className: "!bg-red-600/80 !text-white",
        });
      },
    });

  const handleDeleteAccount = ({ password }: DeleteAccountFormType) => {
    deleteAccount({ password });
  };

  const inputValue = watch("password");

  return (
    <form
      id="delete-account-form"
      onSubmit={handleSubmit(handleDeleteAccount)}
      className="space-y-4 flex flex-col"
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
      <Button
        className={` ${
          isDesktop && "self-end"
        } cursor-pointer bg-red-500 hover:bg-red-400 duration-300 text-white`}
        type="submit"
        disabled={pendingUpdateUserInfos || inputValue === ""}
      >
        <Show when={pendingUpdateUserInfos} fallback={<UserRoundX />}>
          <Loader2Icon className="animate-spin" />
        </Show>
        Excluir Conta
      </Button>
    </form>
  );
};

export default DeleteAccountForm;
