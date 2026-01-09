"use client";

import { CARD_TYPE_LABELS } from "@/src/app/(private)/cartoes/constants/card-type-labels";
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
  showActionButtons?: boolean;
}

export default function TransactionCard({
  transaction,
  showActionButtons = true,
}: TransactionCardProps) {
  const transactionDate = new Date(transaction?.created_at).toISOString();
  const transactionMonth = new Date(transaction.created_at).getMonth() + 1;

  const isIncomeValue = transaction?.type === "income";
  const isExpenseValue = transaction?.type === "expense";

  const paymentMethodIsCard = transaction?.payment_method === "card";

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
      <Flex
        className={`w-full justify-between  gap-2 ${
          showActionButtons ? "flex-col" : "flex-row items-center"
        } md:flex-row md:justify-between md:items-center`}
      >
        <Column>
          <p
            className={`w-full font-semibold text-sm sm:text-lg overflow-hidden overflow-ellipsis whitespace-pre-line ${
              showActionButtons
                ? "max-[425px]:max-w-[160px]"
                : "max-[425px]:max-w-26"
            }`}
          >
            {transaction?.description}
          </p>
          <span className="text-xs sm:text-sm text-gray-500">
            <DateFormatter>{transactionDate}</DateFormatter>
          </span>
        </Column>
        <Row className="gap-4">
          <Column>
            <p
              className={`font-medium ${
                showActionButtons ? "text-start md:text-end" : "text-end"
              } text-end text-base sm:text-xl ${
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
                <Show
                  when={!paymentMethodIsCard}
                  fallback={
                    transaction?.cards && (
                      <Flex
                        className={`flex ${
                          showActionButtons && "flex-row gap-1"
                        } flex-col sm:flex-row sm:items-center sm:gap-1`}
                      >
                        <span>{transaction.cards.name}</span>
                        <span
                          className={`${
                            showActionButtons ? "block" : "hidden"
                          } sm:block`}
                        >
                          -
                        </span>
                        <span className="text-xs sm:text-sm font-bold">
                          {CARD_TYPE_LABELS[transaction.cards.type]}
                        </span>
                      </Flex>
                    )
                  }
                >
                  {transaction?.payment_method}
                </Show>
              </span>
            </Show>
          </Column>
        </Row>
      </Flex>
      <Show when={showActionButtons}>
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
      </Show>
    </Row>
  );
}
