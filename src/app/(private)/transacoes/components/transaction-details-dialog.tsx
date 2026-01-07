"use client";

import { deleteTransaction } from "@/src/app/(private)/transacoes/services";
import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/core/dialog";
import Row from "@/src/components/core/row";
import Show from "@/src/components/core/show";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { useMutation } from "@tanstack/react-query";
import { Edit2Icon, Loader2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UpdateTransactionForm from "./update-transaction-form";

interface TransactionDetailsDialog {
  trigger: React.ReactNode;
  transaction: TransactionType;
  totalIncome: number;
}

const TransactionDetailsDialog = ({
  trigger,
  transaction,
  totalIncome,
}: TransactionDetailsDialog) => {
  const { credentials } = useUserSecrets();

  const [open, setOpen] = useState<boolean>(false);
  const [updateTransactionMode, setUpdateTransactionMode] =
    useState<boolean>(false);

  const { mutate: del, isPending: pendingDeleteTransaction } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async (_, variables) => {
      await queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(
        `Transação "${variables.transaction.description}" removida com sucesso!`,
        {
          className: "!bg-green-600/80 !text-white",
        }
      );
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleDeleteTransaction = (transaction: TransactionType) => {
    del({ transaction, userSecrets: credentials! });
  };

  const transactionTypeTranslation = {
    income: "Entrada",
    expense: "Saída",
    investment: "Investimento",
  } as const;

  const isIncomeValue = transaction?.type === "income";
  const isExpenseValue = transaction?.type === "expense";

  const transactionDate = new Date(transaction.created_at).toISOString();

  const splitCardFromPaymentMethod = transaction?.payment_method?.split("/");
  const paymentMethod = splitCardFromPaymentMethod?.[0];
  const card = splitCardFromPaymentMethod?.[1];

  const percentageOfTotalIncome = (
    (Number(transaction.value) / totalIncome) *
    100
  ).toFixed(1);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setUpdateTransactionMode(false);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {updateTransactionMode ? (
        <DialogContent>
          <UpdateTransactionForm
            transaction={transaction}
            totalIncome={totalIncome}
            cancelUpdateTransaction={() => setUpdateTransactionMode(false)}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="overflow-hidden border-b-1 border-black/10">
            <DialogTitle className="overflow-hidden text-ellipsis pb-2">
              {transaction.description}
            </DialogTitle>
          </DialogHeader>
          <Column className="space-y-2">
            <dl className="space-y-2">
              <Row className="space-x-2">
                <dt className="font-semibold">Tipo:</dt>
                <dd
                  className={`font-semibold  ${
                    isIncomeValue
                      ? "text-green-600"
                      : isExpenseValue
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {transactionTypeTranslation[transaction.type]}
                </dd>
              </Row>
              <Row className="space-x-2">
                <dt className="font-semibold">Valor:</dt>
                <dd>
                  <CurrencyFormatter>{transaction.value}</CurrencyFormatter>
                </dd>
              </Row>
              <Row className="space-x-2">
                <dt className="font-semibold">Data:</dt>
                <dd>
                  <DateFormatter>{transactionDate}</DateFormatter>
                </dd>
              </Row>
              <Show when={Boolean(transaction?.payment_method)}>
                <Row className="space-x-2">
                  <dt className="font-semibold">Método:</dt>
                  <dd>{paymentMethod}</dd>
                </Row>
              </Show>
              <Show
                when={Boolean(transaction?.payment_method) && Boolean(card)}
              >
                <Row className="space-x-2">
                  <dt className="font-semibold">Cartão:</dt>
                  <dd>{card}</dd>
                </Row>
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
              className="cursor-pointer bg-red-500 hover:bg-red-400 duration-300 text-white"
              onClick={() => handleDeleteTransaction(transaction)}
              disabled={pendingDeleteTransaction}
            >
              <Show when={pendingDeleteTransaction} fallback={<Trash2Icon />}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Remover
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => setUpdateTransactionMode(true)}
              disabled={pendingDeleteTransaction}
            >
              <Show fallback={<Edit2Icon />}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default TransactionDetailsDialog;
