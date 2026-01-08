"use client";

import TransactionFormDialog from "@/src/app/(private)/transacoes/components/transaction-form-dialog";
import { deleteTransaction } from "@/src/app/(private)/transacoes/services";
import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import ConfirmDeleteDialog from "@/src/components/confirm-delete-dialog";
import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import Flex from "@/src/components/core/flex";
import Row from "@/src/components/core/row";
import Show from "@/src/components/core/show";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TransactionCardProps {
  transaction: TransactionType;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const transactionDate = new Date(transaction?.created_at).toISOString();
  const transactionMonth = new Date(transaction.created_at).getMonth() + 1;

  const isIncomeValue = transaction?.type === "income";
  const isExpenseValue = transaction?.type === "expense";

  const splitCardFromPaymentMethod = transaction?.payment_method?.split("/");
  const paymentMethod = splitCardFromPaymentMethod?.[0];
  const card = splitCardFromPaymentMethod?.[1];

  const { mutate: del, isPending: pendingDeleteTransaction } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(`Transação removida com sucesso!`, {
        className: "!bg-green-600/80 !text-white",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleDeleteTransaction = (transaction: TransactionType) => {
    del({ transaction });
  };

  return (
    <Row className="p-4 gap-4 h-28 rounded bg-neutral-100 dark:bg-[#202020] justify-between items-center">
      <Flex className="w-full flex-col md:flex-row md:justify-between md:items-center">
        <Column>
          <p className="font-semibold text-base sm:text-lg overflow-hidden whitespace-nowrap overflow-ellipsis max-[400px]:max-w-[160px] max-[500px]:max-w-[250px]">
            {transaction?.description}
          </p>
          <span className="text-xs sm:text-sm text-gray-500">
            <DateFormatter>{transactionDate}</DateFormatter>
          </span>
        </Column>
        <Row className="gap-4">
          <Column>
            <p
              className={`font-medium text-start sm:text-end text-lg sm:text-xl ${
                isIncomeValue
                  ? "text-green-600"
                  : isExpenseValue
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              <CurrencyFormatter>{transaction.value}</CurrencyFormatter>
            </p>
            <Show when={transaction?.payment_method}>
              <span className="text-xs sm:text-sm text-end text-gray-500">
                {paymentMethod}{" "}
                <Show when={card}>
                  - <strong>{card}</strong>
                </Show>
              </span>
            </Show>
          </Column>
        </Row>
      </Flex>
      <Row className="gap-1">
        <TransactionFormDialog
          trigger={
            <Button onClick={() => null}>
              <Pencil />
            </Button>
          }
          mode="update"
          selectedMonth={transactionMonth}
          transaction={transaction}
        />
        <ConfirmDeleteDialog
          title="Excluir Transação"
          itemName={transaction?.description}
          description="Você tem certeza de que deseja excluir esta transação? Esta ação não poderá ser desfeita."
          onConfirm={() => handleDeleteTransaction(transaction)}
          isPending={pendingDeleteTransaction}
          trigger={
            <Button variant="destructive">
              <Trash2 className="text-white" />
            </Button>
          }
        />
      </Row>
    </Row>
  );
}
