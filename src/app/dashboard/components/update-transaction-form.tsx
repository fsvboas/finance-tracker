import { Button } from "@/src/components/button";
import DatePicker from "@/src/components/date-picker";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/dialog";
import { Input } from "@/src/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/select";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { currencyFormatter } from "@/src/helpers/currency-formatter";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { TransactionType } from "@/src/types/transaction-type";
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

const UpdateTransactionForm = ({
  transaction,
  totalIncome,
  cancelUpdateTransaction,
}: UpdateTransactionFormProps) => {
  const { credentials } = useUserSecrets();

  const splitCardFromPaymentMethod = transaction?.payment_method?.split("/");
  const paymentMethod = splitCardFromPaymentMethod?.[0];
  const card = splitCardFromPaymentMethod?.[1];

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<TransactionFormSchemaType>({
      resolver: zodResolver(transactionFormSchema),
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
        {
          className: "!bg-green-600/80 !text-white",
        }
      );
      cancelUpdateTransaction();
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleUpdateTransaction = (data: TransactionFormSchemaType) => {
    const paymentMethod = isNotCreditOrDebitCard
      ? data.payment_method
      : `${data.payment_method}/${data.card}`;

    const payload: Omit<TransactionType, "id" | "user_id"> = {
      ...data,
      created_at: data.created_at.toISOString(),
      payment_method: paymentMethod,
    };

    update({
      transactionId: transaction.id,
      transaction: payload,
      userSecrets: credentials!,
    });
  };

  const transactionTypeOptions = ["income", "expense", "investment"] as const;
  const transactionTypeTranslation = {
    income: "Entrada",
    expense: "Saída",
    investment: "Investimento",
  } as const;

  const transactionTypeFieldValue = watch("type");
  const isIncomeType = transactionTypeFieldValue === "income";

  console.log("@@@, transactionTypeFieldValue", transactionTypeFieldValue);
  console.log("@@@, isIncomeType", isIncomeType);

  const transactionValueFieldValue = watch("value");
  const percentageOfTotalIncome = (
    (Number(transactionValueFieldValue) / totalIncome) *
    100
  ).toFixed(1);

  const transactionPaymentMethodFieldValue = watch("payment_method");
  const isNotCreditOrDebitCard =
    transactionPaymentMethodFieldValue !== "Crédito" &&
    transactionPaymentMethodFieldValue !== "Débito";

  console.log("@@@@ transaction", transaction);

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
                <Column>
                  <Input id="description" value={value} onChange={onChange} />
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
        <dl className="space-y-2">
          <Row className="space-x-2 items-center">
            <dt className="font-semibold">Tipo:</dt>
            <dd>
              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full sm:w-[200px] text-base">
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
            <dt className="font-semibold">Valor:</dt>
            <dd>
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
            </dd>
          </Row>
          <Row className="space-x-2 items-center">
            <dt className="font-semibold">Data:</dt>
            <dd>
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
            </dd>
          </Row>
          <Show when={!isIncomeType}>
            <Show when={Boolean(transactionPaymentMethodFieldValue)}>
              <Row className="space-x-2 items-center">
                <dt className="font-semibold">Método:</dt>
                <dd>
                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Column>
                        <PaymentMethodSelectInput
                          value={value}
                          onChange={onChange}
                        />
                      </Column>
                    )}
                  />
                </dd>
              </Row>
            </Show>

            <Show when={Boolean(transactionPaymentMethodFieldValue)}>
              <Row className="space-x-2 items-center">
                <dt className="font-semibold">Cartão:</dt>
                <dd>
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
                          disabled={isNotCreditOrDebitCard}
                        />
                        <Show when={error}>
                          <span className="text-xs text-red-600">
                            {error?.message}
                          </span>
                        </Show>
                      </Column>
                    )}
                  />
                </dd>
              </Row>
            </Show>
          </Show>

          <Show
            when={
              totalIncome !== 0 &&
              (transaction.type === "expense" ||
                transaction.type === "investment")
            }
          >
            <Row className="space-x-2">
              <dt className="font-semibold">Percentual:</dt>
              <dd>{percentageOfTotalIncome}%</dd>
            </Row>
          </Show>
        </dl>
      </Column>
      <DialogFooter>
        <Button
          className="cursor-pointer"
          onClick={cancelUpdateTransaction}
          //   disabled={pendingUpdateTransaction}
          variant="outline"
        >
          <XIcon />
          Cancelar
        </Button>
        <Button
          className="cursor-pointer"
          type="submit"
          //   disabled={pendingUpdateTransaction}
        >
          <Show
            // when={pendingUpdateTransaction}
            when={false}
            fallback={<CheckIcon />}
          >
            <Loader2Icon className="animate-spin" />
          </Show>
          Aplicar
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UpdateTransactionForm;
