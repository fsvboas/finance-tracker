"use client";

import {
  postTransaction,
  updateTransaction,
} from "@/src/app/(private)/transacoes/services";
import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import DatePicker from "@/src/components/core/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/core/dialog";
import Flex from "@/src/components/core/flex";
import { Input } from "@/src/components/core/input";
import { Label } from "@/src/components/core/label";
import Show from "@/src/components/core/show";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/core/tabs";
import { currencyFormatter } from "@/src/helpers/currency-formatter";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import CardSelectInput from "./card-select-combobox-input";
import PaymentMethodSelectInput from "./payment-method-select-input";
import RepeatTransactionSelectInput from "./repeat-transaction-select-input";

interface TransactionFormDialogProps {
  trigger: React.ReactNode;
  selectedMonth: number;
  mode?: "create" | "update";
  transaction?: TransactionType;
}

const transactionFormSchema = z.object({
  type: z.enum(["income", "expense", "investment"]),
  description: z.string().min(1, { message: "Campo obrigatório." }),
  value: z
    .string()
    .min(1, { message: "Campo obrigatório." })
    .refine((value) => Number(value) > 0, { message: "Campo obrigatório." }),
  created_at: z.date(),
  payment_method: z.string().optional(),
  card: z.string().optional(),
  repeat_months: z.string().optional(),
});

type TransactionFormSchemaType = z.infer<typeof transactionFormSchema>;

const TransactionFormDialog = ({
  trigger,
  selectedMonth,
  mode = "create",
  transaction,
}: TransactionFormDialogProps) => {
  const { credentials } = useUserSecrets();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isUpdateMode = mode === "update";

  const getDefaultFormValues = (
    month: number,
    existingTransaction?: TransactionType
  ) => {
    if (existingTransaction) {
      const [paymentMethod, card] = (
        existingTransaction.payment_method || ""
      ).split("/");

      return {
        description: existingTransaction.description,
        value: String(
          Number(existingTransaction.value.replace(/\D/g, "")) || 0
        ),
        type: existingTransaction.type,
        created_at: new Date(existingTransaction.created_at),
        payment_method: paymentMethod || "",
        card: card || "",
        repeat_months: "1",
      };
    }

    const date = new Date();
    date.setMonth(month - 1);

    return {
      description: "",
      value: "",
      type: "income" as const,
      created_at: date,
      payment_method: "",
      card: "",
      repeat_months: "1",
    };
  };

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<TransactionFormSchemaType>({
      resolver: zodResolver(transactionFormSchema),
      defaultValues: getDefaultFormValues(selectedMonth, transaction),
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
      const repeatMonths = Number(variables.repeatMonths || 1);
      const successMessage =
        repeatMonths > 1
          ? `Transação "${variables.transaction.description}" adicionada para os próximos ${repeatMonths} meses com sucesso!`
          : `Transação "${variables.transaction.description}" adicionada com sucesso!`;

      toast.success(successMessage, {
        className: "!bg-green-600/80 !text-white",
      });

      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const { mutate: update, isPending: pendingUpdateTransaction } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: async (_, variables) => {
      await queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(
        `Transação "${variables.transaction.description}" editada com sucesso!`,
        { className: "!bg-green-600/80 !text-white" }
      );
    },
    onError: (error) => {
      toast.error(error.message, { className: "!bg-red-600/80 !text-white" });
    },
  });

  const handleSubmitForm = (formData: TransactionFormSchemaType) => {
    const paymentMethod = isNotCreditOrDebitCard
      ? formData.payment_method
      : `${formData.payment_method}/${formData.card}`;

    const payload: TransactionType = {
      id: transaction?.id || crypto.randomUUID(),
      ...formData,
      created_at: formData.created_at.toISOString(),
      payment_method: paymentMethod,
    };

    if (isUpdateMode) {
      return update({ transaction: payload, userSecrets: credentials! });
    }

    const repeatMonths = Number(formData.repeat_months || 1);

    post({
      transaction: payload,
      userSecrets: credentials!,
      repeatMonths,
    });
  };

  useEffect(() => {
    if (isNotCreditOrDebitCard) {
      setValue("card", "", { shouldValidate: false });
    }
  }, [isNotCreditOrDebitCard, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultFormValues(selectedMonth, transaction));
    }
  }, [isOpen, reset, selectedMonth, transaction]);

  const isPending = pendingPostTransaction || pendingUpdateTransaction;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          id="transaction-form"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="space-y-4 my-4"
        >
          <DialogHeader>
            <DialogTitle>
              {isUpdateMode ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="items-center"
                >
                  <TabsList className="w-full">
                    <TabsTrigger
                      className="!text-green-600 hover:cursor-pointer"
                      value="income"
                    >
                      Entrada
                    </TabsTrigger>
                    <TabsTrigger
                      className="!text-red-600 hover:cursor-pointer"
                      value="expense"
                    >
                      Saída
                    </TabsTrigger>
                    <TabsTrigger
                      className="!text-yellow-600 hover:cursor-pointer"
                      value="investment"
                    >
                      Investimento
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </DialogHeader>
          <Column>
            <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2">
              <Column className="space-y-2 w-full">
                <Label htmlFor="description">
                  Transação<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Column>
                      <Input
                        id="description"
                        placeholder="Salário"
                        value={value}
                        onChange={onChange}
                        className={`min-w-[180px] w-full ${
                          error && "border-red-600"
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
              <Column className="space-y-2">
                <Label htmlFor="value">
                  Valor<span className="text-red-500">*</span>
                </Label>
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
                        inputMode="numeric"
                        placeholder="R$ 2.000,00"
                        value={currencyFormatter(Number(value))}
                        onChange={(event) => {
                          const rawValue = event.target.value.replace(
                            /\D/g,
                            ""
                          );
                          onChange(rawValue);
                        }}
                        className={`w-full sm:w-[150px] ${
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
            </Flex>
            <Show when={isExpenseTransaction}>
              <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2 mt-4">
                <Column className="space-y-2 w-full">
                  <Label htmlFor="payment_method">Método de pagamento</Label>
                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Column className="w-full">
                        <PaymentMethodSelectInput
                          value={value ?? ""}
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
            <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2 mt-4">
              <Column className="space-y-2 sm:w-[150px]">
                <Label htmlFor="created_at">Data</Label>
                <Controller
                  name="created_at"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Column className="w-full">
                      <DatePicker
                        value={value}
                        onValueChange={(date) => onChange(date)}
                      />
                      <div className="h-2 -mt-1" />
                    </Column>
                  )}
                />
              </Column>
              <Show when={!isUpdateMode}>
                <Column className="space-y-2 w-full sm:max-w-[146px]">
                  <Label htmlFor="repeat_months">Repetir por</Label>
                  <Controller
                    name="repeat_months"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Column className="w-full">
                        <RepeatTransactionSelectInput
                          value={value ?? ""}
                          onChange={onChange}
                        />
                        <div className="h-2 -mt-1" />
                      </Column>
                    )}
                  />
                </Column>
              </Show>
            </Flex>
          </Column>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="hover:cursor-pointer"
                variant="secondary"
                disabled={isPending}
              >
                <XIcon />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              <Show
                when={isPending}
                fallback={isUpdateMode ? <SaveIcon /> : <PlusIcon />}
              >
                <Loader2Icon className="animate-spin" />
              </Show>
              {isUpdateMode ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
