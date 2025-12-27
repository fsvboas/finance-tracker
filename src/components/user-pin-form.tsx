import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { BrushCleaning, Delete, Loader2Icon, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { doLogout } from "../app/(public)/entrar/services";

import {
  createUserPin,
  validateUserPin,
} from "@/src/app/(private)/dashboard/services";
import { useUserSecrets } from "../providers/user-secrets-provider";
import { Button } from "./button";
import { Input } from "./input";
import Column from "./utils/column";
import Row from "./utils/row";
import Show from "./utils/show";

const PinFormSchema = z.object({
  pin: z.string().length(4, "PIN deve ter exatamente 4 caracteres"),
});

type PinFormSchemaType = z.infer<typeof PinFormSchema>;

interface UserPinFormProps {
  userId: string;
  mode: "create" | "validate";
  setIsOpen: (open: boolean) => void;
}

const UserPinForm = ({ userId, mode, setIsOpen }: UserPinFormProps) => {
  const { setCredentials, clearCredentials } = useUserSecrets();
  const route = useRouter();

  const { handleSubmit, control } = useForm<PinFormSchemaType>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: { pin: "" },
  });

  const { mutate: create, isPending: pendingCreateUserPin } = useMutation({
    mutationFn: createUserPin,
    onSuccess: (data, variables) => {
      setCredentials({ pin: variables.pin, salt: data });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const { mutate: validate, isPending: pendingValidateUserPin } = useMutation({
    mutationFn: validateUserPin,
    onSuccess: async (_, variables) => {
      const salt = await validateUserPin({
        userId: variables.userId,
        pin: variables.pin,
      });
      setCredentials({ pin: variables.pin, salt: salt });
      queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const { mutate: logout, isPending: pendingLogout } = useMutation({
    mutationFn: doLogout,
    onSuccess: () => {
      clearCredentials();
      route.push("/entrar");
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const buttons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "Limpar",
    "0",
    "Apagar",
  ];

  const handleButtonClick = (
    value: string,
    currentValue: string,
    onChange: (value: string) => void
  ) => {
    if (value === "Apagar") {
      const newValue = currentValue.slice(0, -1);
      onChange(newValue);
    } else if (value === "Limpar") {
      onChange("");
    } else if (currentValue.length < 4 && !isNaN(Number(value))) {
      const newValue = currentValue + value;
      onChange(newValue);
    }
  };

  const onSubmit = async (data: PinFormSchemaType) => {
    if (mode === "create") return create({ userId, pin: data.pin });
    validate({ userId, pin: data.pin });
  };

  const pending = pendingCreateUserPin || pendingValidateUserPin;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Column className="space-y-2">
        <Controller
          name="pin"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <Input
                readOnly
                value={value}
                placeholder="****"
                type="password"
                className="text-center tracking-widest"
              />
              <div className="grid grid-cols-3 gap-1">
                {buttons.map((button, index) => {
                  const buttonLabel =
                    button === "Apagar" ? (
                      <Delete />
                    ) : button === "Limpar" ? (
                      <BrushCleaning />
                    ) : (
                      button
                    );
                  return (
                    <Button
                      key={index}
                      type="button"
                      className="cursor-pointer bg-neutral-200 dark:bg-[#202020] text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-[#101010] p-6"
                      onClick={() => handleButtonClick(button, value, onChange)}
                      disabled={
                        (button === "Apagar" || button === "Limpar") &&
                        value.length === 0
                      }
                    >
                      {buttonLabel}
                    </Button>
                  );
                })}
              </div>
              <Button
                type="submit"
                className="cursor-pointer bg-green-500 hover:bg-green-400 w-full text-white p-6"
                disabled={value.length !== 4 || pending}
              >
                <Show when={pending} fallback={<LogIn />}>
                  <Loader2Icon className="animate-spin" />
                </Show>
                Entrar
              </Button>
              <Row className="w-full items-center justify-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-red-500"
                  onClick={() => logout()}
                  disabled={pendingLogout}
                >
                  Sair
                </Button>
              </Row>
            </>
          )}
        />
      </Column>
    </form>
  );
};

export default UserPinForm;
