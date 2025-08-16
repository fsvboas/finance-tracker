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
import { useUserSecrets } from "@/src/contexts/user-secrets-context";
import { currencyFormatter } from "@/src/helpers/currency-formatter";
import { useAuth } from "@/src/hooks/use-auth";
import { queryClient } from "@/src/libs/tanstack-query";
import { TransactionType } from "@/src/types/transaction-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import CardSelectInput from "./card-select-combobox-input";
import PaymentMethodSelectInput from "./payment-method-select-input";

interface AddTransactionFormDialogProps {
  trigger: React.ReactNode;
}

const schema = z
  .object({
    type: z.enum(["income", "expense"]),
    description: z.string().min(1, { message: "Campo obrigatório." }),
    value: z.string().min(1, { message: "Campo obrigatório." }),
    created_at: z.date(),
    payment_method: z.string(),
    card: z.string().optional(),
  })
  .refine(
    (data) =>
      !(
        data.payment_method === "Crédito" || data.payment_method === "Débito"
      ) ||
      (data.card && data.card.trim() !== ""),
    {
      message: "Campo obrigatório.",
      path: ["card"],
    }
  );

type TransactionFormSchemaType = z.infer<typeof schema>;

const AddTransactionFormDialog = ({
  trigger,
}: AddTransactionFormDialogProps) => {
  const { credentials } = useUserSecrets();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<TransactionFormSchemaType>({
      resolver: zodResolver(schema),
      defaultValues: {
        description: "",
        value: "",
        type: "income",
        created_at: new Date(),
        payment_method: "",
        card: "",
      },
    });

  const paymentMethodFieldValue = watch("payment_method");
  const isNotCreditOrDebitCard =
    paymentMethodFieldValue !== "Crédito" &&
    paymentMethodFieldValue !== "Débito";

  const transactionType = watch("type");
  const isExpenseTransaction = transactionType === "expense";

  const { mutate: post, isPending: pendingPostTransaction } = useMutation({
    mutationFn: postTransaction,
    onSuccess: async (_, variables) => {
      await queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(
        `Transação "${variables.transaction.description}" adicionada com sucesso!`,
        {
          className: "!bg-green-600/80 !text-white",
        }
      );
      setIsOpen(false);
    },
    onError: (error) => {
      // TO-DO: Translate error messages
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleAddTransaction = (transaction: TransactionFormSchemaType) => {
    const paymentMethod = isNotCreditOrDebitCard
      ? transaction.payment_method
      : `${transaction.payment_method}/${transaction.card}`;

    const payload: TransactionType = {
      id: crypto.randomUUID(),
      user_id: user!.id,
      ...transaction,
      created_at: transaction.created_at.toISOString(),
      payment_method: paymentMethod,
    };

    post({ transaction: payload, userSecrets: credentials! });
  };

  useEffect(() => {
    if (isNotCreditOrDebitCard) {
      setValue("card", "", { shouldValidate: false });
    }
  }, [isNotCreditOrDebitCard, setValue]);

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
              name="type"
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
                      value="income"
                    >
                      Entrada
                    </TabsTrigger>
                    <TabsTrigger
                      className="text-red-600 hover:cursor-pointer"
                      value="expense"
                    >
                      Saída
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </DialogHeader>
          <Column>
            <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2">
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
                        className={`min-w-[200px] ${error && "border-red-600"}`}
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
                          const rawValue = event.target.value.replace(
                            /\D/g,
                            ""
                          );
                          onChange(rawValue);
                        }}
                        className={`w-full sm:max-w-[150px] ${
                          error ? "border-red-600" : ""
                        }`}
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
              <Column className="space-y-2 mb-4">
                <Label htmlFor="created_at">Data</Label>
                <Controller
                  name="created_at"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Column>
                      <DatePicker
                        value={value}
                        onValueChange={(date) => onChange(date)}
                      />
                      <div className="h-2 -mt-1" />
                    </Column>
                  )}
                />
              </Column>
            </Flex>
            <Show when={isExpenseTransaction}>
              <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2">
                <Column className="space-y-2">
                  <Label htmlFor="payment_method">Método de pagamento</Label>
                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Column>
                        <PaymentMethodSelectInput
                          value={value}
                          onChange={onChange}
                        />
                        <div className="h-2 -mt-1" />
                      </Column>
                    )}
                  />
                </Column>
                <Column className="space-y-2 w-full">
                  <Label htmlFor="card">Cartão</Label>
                  <Controller
                    name="card"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Column>
                        <CardSelectInput
                          value={value ?? ""}
                          onChange={onChange}
                          disabled={isNotCreditOrDebitCard}
                          error={Boolean(error)}
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
              </Flex>
            </Show>
          </Column>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="hover:cursor-pointer"
                variant="secondary"
                disabled={pendingPostTransaction}
              >
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
