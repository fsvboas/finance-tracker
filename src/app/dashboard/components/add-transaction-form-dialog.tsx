"use client";

import { postTransaction } from "@/src/app/dashboard/services";
import { Button } from "@/src/components/button";
import DatePicker from "@/src/components/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/dialog";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/tabs";
import Column from "@/src/components/utils/column";
import Flex from "@/src/components/utils/flex";
import Show from "@/src/components/utils/show";
import { currencyFormatter } from "@/src/helpers/currency-formatter";
import { queryClient } from "@/src/libs/tanstack-query";
import { TransactionType } from "@/src/types/transaction-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface AddTransactionFormDialogProps {
  trigger: React.ReactNode;
}

const schema = z.object({
  transactionType: z.enum(["incoming", "outcoming"]),
  description: z
    .string()
    .min(1, { message: "Adicione uma descrição para a transação." }),
  value: z.string().min(1, { message: "Adicione o valor da transação." }),
  date: z.date(),
});

type TransactionFormSchemaType = z.infer<typeof schema>;

const AddTransactionFormDialog = ({
  trigger,
}: AddTransactionFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { control, handleSubmit, reset } = useForm<TransactionFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      transactionType: "incoming",
      description: "",
      value: "",
      date: new Date(),
    },
  });

  const { mutate: post, isPending: pendingPostTransaction } = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      setIsOpen(false);
      toast.success("Transação adicionada com sucesso!", {
        className: "!bg-green-600/80 !text-white",
      });
    },
    onError: (error) => {
      // TO-DO: Translate error messages
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleAddTransaction = (transaction: TransactionFormSchemaType) => {
    const payload: TransactionType = {
      id: crypto.randomUUID(),
      ...transaction,
    };
    post({ transaction: payload });
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          id="transaction-form"
          onSubmit={handleSubmit(handleAddTransaction)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle />
            <Controller
              name="transactionType"
              control={control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="items-center"
                >
                  <TabsList className="w-[80%] sm:w-1/2">
                    <TabsTrigger
                      className="text-green-600 hover:cursor-pointer"
                      value="incoming"
                    >
                      Entrada
                    </TabsTrigger>
                    <TabsTrigger
                      className="text-red-600 hover:cursor-pointer"
                      value="outcoming"
                    >
                      Saída
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </DialogHeader>
          <Column className="space-y-2">
            <Label htmlFor="transaction">Transação</Label>
            <Controller
              name="description"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="transaction"
                    placeholder="Salário"
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
          <Flex className="min-[500px]:space-x-2 max-[500px]:flex-col max-[500px]:space-y-4">
            <Column className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Controller
                name="value"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Column>
                    <Input
                      id="value"
                      placeholder="R$ 2.000,00"
                      value={currencyFormatter(Number(value))}
                      onChange={(event) => {
                        const rawValue = event.target.value.replace(/\D/g, "");
                        onChange(rawValue);
                      }}
                      className={`${error ? "border-red-600" : ""}`}
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
            <Controller
              name="date"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  value={value}
                  onValueChange={(date) => onChange(date)}
                />
              )}
            />
          </Flex>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="hover:cursor-pointer" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={pendingPostTransaction}
            >
              <Show when={pendingPostTransaction}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionFormDialog;
