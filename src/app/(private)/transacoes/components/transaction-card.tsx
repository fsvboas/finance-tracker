"use client";

import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import Column from "@/src/components/core/column";
import Row from "@/src/components/core/row";
import Show from "@/src/components/core/show";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";
import TransactionDetailsDialog from "./transaction-details-dialog";

interface TransactionCardProps {
  transaction: TransactionType;
  totalIncome: number;
}

export default function TransactionCard({
  transaction,
  totalIncome,
}: TransactionCardProps) {
  const transactionDate = new Date(transaction?.created_at).toISOString();

  const isIncomeValue = transaction?.type === "income";
  const isExpenseValue = transaction?.type === "expense";

  const splitCardFromPaymentMethod = transaction?.payment_method?.split("/");
  const paymentMethod = splitCardFromPaymentMethod?.[0];
  const card = splitCardFromPaymentMethod?.[1];

  return (
    <TransactionDetailsDialog
      transaction={transaction}
      totalIncome={totalIncome}
      trigger={
        <Row
          className={`p-4 h-20 rounded bg-neutral-100 dark:bg-[#202020] hover:bg-neutral-200 dark:hover:bg-[#101010] duration-300 justify-between items-center`}
        >
          <Column>
            <p className="font-semibold text-base sm:text-lg overflow-hidden whitespace-nowrap overflow-ellipsis max-[400px]:max-w-[165px] max-[500px]:max-w-[250px]">
              {transaction?.description}
            </p>
            <span className="text-xs sm:text-sm text-gray-500">
              <DateFormatter>{transactionDate}</DateFormatter>
            </span>
          </Column>
          <Column>
            <p
              className={`text-lg sm:text-xl text-end ${
                isIncomeValue
                  ? "text-green-600"
                  : isExpenseValue
                  ? "text-red-600"
                  : "text-yellow-600"
              }  font-medium`}
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
      }
    />
  );
}
