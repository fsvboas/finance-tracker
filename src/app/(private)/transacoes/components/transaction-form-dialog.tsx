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
import CardSelectInput from "./card-select-input";
import PaymentMethodSelectInput from "./payment-method-select-input";
import RepeatTransactionSelectInput from "./repeat-transaction-select-input";

interface TransactionFormDialogProps {
  trigger: React.ReactNode;
  selectedMonth: number;
  mode?: "create" | "update";
  transaction?: TransactionType;
}

const transactionFormSchema = z
  .object({
    type: z.enum(["income", "expense", "investment"]),
    description: z.string().min(1, { message: "Campo obrigatório." }),
    value: z
      .string()
      .min(1, { message: "Campo obrigatório." })
      .refine((value) => Number(value) > 0, { message: "Campo obrigatório." }),
    created_at: z.date(),
    payment_method: z.string().optional(),
    card_id: z.string().optional(),
    repeat_months: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.payment_method === "card" && !data.card_id) {
        return false;
      }
      return true;
    },
    {
      message: "Selecione um cartão quando o método de pagamento for cartão",
      path: ["card_id"],
    }
  );

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
      return {
        description: existingTransaction.description,
        value: String(
          Number(existingTransaction.value.replace(/\D/g, "")) || 0
        ),
        type: existingTransaction.type,
        created_at: new Date(existingTransaction.created_at),
        payment_method: existingTransaction.payment_method || "",
        card_id: existingTransaction.card_id || "",
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
      card_id: "",
      repeat_months: "1",
    };
  };

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<TransactionFormSchemaType>({
      resolver: zodResolver(transactionFormSchema),
      defaultValues: getDefaultFormValues(selectedMonth, transaction),
    });

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
    const payload: TransactionType = {
      id: transaction?.id || crypto.randomUUID(),
      ...formData,
      created_at: formData.created_at.toISOString(),
      payment_method: formData.payment_method,
      card_id: formData.card_id,
    };

    console.log("@@payload", payload);

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

  const paymentMethodFieldValue = watch("payment_method");
  const paymentMethodIsCard = paymentMethodFieldValue === "card";

  const transactionType = watch("type");
  const isExpenseTransaction = transactionType === "expense";
  const isInvestmentTransaction = transactionType === "investment";

  const dialogTitle = isUpdateMode ? "Editar Transação" : "Nova Transação";
  const transactionDescriptionPlaceholder = isExpenseTransaction
    ? "Calça Jeans"
    : isInvestmentTransaction
    ? "Viagem"
    : "Salário";

  const isPending = pendingPostTransaction || pendingUpdateTransaction;

  useEffect(() => {
    if (!paymentMethodIsCard) {
      setValue("card_id", "", { shouldValidate: false });
    }
  }, [paymentMethodIsCard, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultFormValues(selectedMonth, transaction));
    }
  }, [isOpen, reset, selectedMonth, transaction]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          id="transaction-form"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="my-4"
        >
          <DialogHeader className="mb-4">
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <Column className="gap-4 grid grid-cols-6">
            <div className="col-span-6">
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
            </div>
            <Column className="space-y-2 col-span-6">
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
                      placeholder={transactionDescriptionPlaceholder}
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
            <Column
              className={`space-y-2 max-[560px]:col-span-6 ${
                !isExpenseTransaction
                  ? "col-span-2"
                  : paymentMethodIsCard
                  ? "col-span-2"
                  : "col-span-3"
              }`}
            >
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
            <Show when={isExpenseTransaction}>
              <Column
                className={`space-y-2 max-[560px]:col-span-6 ${
                  paymentMethodIsCard ? "col-span-2" : "col-span-3"
                } `}
              >
                <Label htmlFor="payment_method">Método de pagamento</Label>
                <Controller
                  name="payment_method"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Column>
                      <PaymentMethodSelectInput
                        value={value ?? ""}
                        onChange={onChange}
                      />
                      <div className="h-2 -mt-1" />
                    </Column>
                  )}
                />
              </Column>
              <Show when={paymentMethodIsCard}>
                <Column className="space-y-2 col-span-2 max-[560px]:col-span-6">
                  <Label htmlFor="card_id">
                    Cartão<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="card_id"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Column>
                        <CardSelectInput
                          value={value ?? ""}
                          onChange={onChange}
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
              </Show>
            </Show>
            <Column
              className={`space-y-2 max-[560px]:col-span-6 ${
                !isExpenseTransaction ? "col-span-2" : "col-span-3"
              } `}
            >
              <Label htmlFor="created_at">
                Data<span className="text-red-500">*</span>
              </Label>
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
            <Show when={!isUpdateMode}>
              <Column
                className={`space-y-2 max-[560px]:col-span-6 ${
                  !isExpenseTransaction ? "col-span-2" : "col-span-3"
                } `}
              >
                <Label htmlFor="repeat_months">Repetir por</Label>
                <Controller
                  name="repeat_months"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Column>
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
          </Column>
          <DialogFooter className="mt-4">
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
