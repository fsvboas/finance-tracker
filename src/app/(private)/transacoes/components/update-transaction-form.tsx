import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import DatePicker from "@/src/components/core/date-picker";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/core/dialog";
import { Input } from "@/src/components/core/input";
import Row from "@/src/components/core/row";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/core/select";
import Show from "@/src/components/core/show";
import { currencyFormatter } from "@/src/helpers/currency-formatter";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateTransaction } from "../services";
import {
  transactionFormSchema,
  TransactionFormSchemaType,
} from "./add-transaction-form-dialog";
import CardSelectInput from "./card-select-combobox-input";
import PaymentMethodSelectInput from "./payment-method-select-input";

interface UpdateTransactionFormProps {
  transaction: TransactionType;
  totalIncome: number;
  cancelUpdateTransaction: () => void;
}

const transactionTypeOptions = ["income", "expense", "investment"] as const;
const transactionTypeTranslation = {
  income: "Entrada",
  expense: "Saída",
  investment: "Investimento",
} as const;

const UpdateTransactionForm = ({
  transaction,
  totalIncome,
  cancelUpdateTransaction,
}: UpdateTransactionFormProps) => {
  const { credentials } = useUserSecrets();

  const splitCardFromPaymentMethod = transaction?.payment_method?.split("/");
  const paymentMethod = splitCardFromPaymentMethod?.[0];
  const card = splitCardFromPaymentMethod?.[1];

  const { control, handleSubmit, watch } = useForm<TransactionFormSchemaType>({
    resolver: zodResolver(transactionFormSchema),
    shouldUnregister: true,
    defaultValues: {
      description: transaction?.description,
      value: transaction?.value,
      type: transaction?.type,
      created_at: new Date(transaction?.created_at),
      payment_method: paymentMethod,
      card: card,
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
      cancelUpdateTransaction();
    },
    onError: (error) => {
      toast.error(error.message, { className: "!bg-red-600/80 !text-white" });
    },
  });

  const transactionTypeFieldValue = watch("type");
  const transactionValueFieldValue = watch("value");
  const transactionPaymentMethodFieldValue = watch("payment_method");

  const isExpenseType = transactionTypeFieldValue === "expense";
  const isIncomeType = transactionTypeFieldValue === "income";
  const isCreditOrDebit =
    transactionPaymentMethodFieldValue === "Crédito" ||
    transactionPaymentMethodFieldValue === "Débito";

  const percentageOfTotalIncome = (
    (Number(transactionValueFieldValue) / totalIncome) *
    100
  ).toFixed(1);

  const handleUpdateTransaction = (data: TransactionFormSchemaType) => {
    const isIncome = data.type === "income";
    const isCreditOrDebitLocal =
      data.payment_method === "Crédito" || data.payment_method === "Débito";

    const formattedPaymentMethod = isIncome
      ? undefined
      : isCreditOrDebitLocal
      ? `${data.payment_method}/${data.card}`
      : data.payment_method;

    const payload: TransactionType = {
      ...data,
      id: transaction.id,
      created_at: data.created_at.toISOString(),
      payment_method: formattedPaymentMethod,
    };

    update({
      transaction: payload,
      userSecrets: credentials!,
    });
  };

  return (
    <form
      id="update-transaction-form"
      onSubmit={handleSubmit(handleUpdateTransaction)}
      className="space-y-4 my-4"
    >
      <DialogHeader className="overflow-hidden border-b-1 border-black/10">
        <DialogTitle className="overflow-hidden text-ellipsis pb-2">
          <Row className="space-x-2">
            <Controller
              name="description"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Column className="w-full">
                  <Input
                    id="description"
                    value={value}
                    onChange={onChange}
                    className="w-full"
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
          </Row>
        </DialogTitle>
      </DialogHeader>
      <Column className="space-y-2">
        <dl className="space-y-5">
          <Row className="space-x-2 items-center">
            <dt className="font-semibold w-20">Tipo:</dt>
            <dd className="w-full">
              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {transactionTypeOptions.map(
                          (transactionType, index) => (
                            <SelectItem key={index} value={transactionType}>
                              {transactionTypeTranslation[transactionType]}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </dd>
          </Row>
          <Row className="space-x-2 items-center">
            <dt className="font-semibold w-20">Valor:</dt>
            <dd className="w-full">
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
                      className={`w-full ${error ? "border-red-600" : ""}`}
                    />
                    <Show when={error}>
                      <div className="h-2 -mt-1">
                        <span className="text-xs text-red-600">
                          {error?.message}
                        </span>
                      </div>
                    </Show>
                  </Column>
                )}
              />
            </dd>
          </Row>
          <Row className="space-x-2 items-center">
            <dt className="font-semibold w-20">Data:</dt>
            <dd className="w-full">
              <Controller
                name="created_at"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    value={value}
                    onValueChange={(date) => onChange(date)}
                  />
                )}
              />
            </dd>
          </Row>
          <Show when={isExpenseType}>
            <Row className="space-x-2 items-center">
              <dt className="font-semibold w-20">Método:</dt>
              <dd className="w-full">
                <Controller
                  name="payment_method"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PaymentMethodSelectInput
                      value={value ?? ""}
                      onChange={onChange}
                    />
                  )}
                />
              </dd>
            </Row>
            <Row className="space-x-2 items-center">
              <dt className="font-semibold w-20">Cartão:</dt>
              <dd className="w-full">
                <Controller
                  name="card"
                  control={control}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Column>
                      <CardSelectInput
                        value={value ?? ""}
                        onChange={onChange}
                        error={Boolean(error)}
                        disabled={!isCreditOrDebit}
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
              </dd>
            </Row>
          </Show>
          <Show when={totalIncome !== 0 && !isIncomeType}>
            <Row className="space-x-4">
              <dt className="font-semibold w-20">Percentual:</dt>
              <dd>{percentageOfTotalIncome}%</dd>
            </Row>
          </Show>
        </dl>
      </Column>
      <DialogFooter>
        <Button
          className="cursor-pointer"
          onClick={cancelUpdateTransaction}
          variant="outline"
        >
          <XIcon />
          Cancelar
        </Button>
        <Button
          className="cursor-pointer"
          type="submit"
          disabled={pendingUpdateTransaction}
        >
          <Show when={pendingUpdateTransaction} fallback={<CheckIcon />}>
            <Loader2Icon className="animate-spin" />
          </Show>
          Aplicar
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UpdateTransactionForm;
