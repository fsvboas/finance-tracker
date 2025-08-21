"use client";

import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";
import { TransactionType } from "@/src/types/transaction-type";
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
            <p className="font-semibold text-lg text-ellipsis overflow-hidden max-[400px]:max-w-[150px] max-[500px]:max-w-[250px] [150px]:max-w-full">
              {transaction?.description}
            </p>
            <span className="text-xs">
              <DateFormatter>{transactionDate}</DateFormatter>
            </span>
          </Column>
          <Column>
            <p
              className={`text-xl text-end ${
                isIncomeValue
                  ? "text-green-600"
                  : isExpenseValue
                  ? "text-red-600"
                  : "text-yellow-500"
              }  font-medium`}
            >
              <CurrencyFormatter>{transaction.value}</CurrencyFormatter>
            </p>
            <Show when={transaction?.payment_method}>
              <span className="text-xs text-end">
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
