"use client";

import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";
import { TransactionType } from "@/src/types/transaction-type";
import TransactionDetailsDialog from "./transaction-details-dialog";

interface TransactionCardProps {
  transaction: TransactionType;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const transactionDate = new Date(transaction?.date).toISOString();

  const isIncomingValue = transaction?.transactionType === "incoming";

  return (
    <TransactionDetailsDialog
      transaction={transaction}
      trigger={
        <Row
          className={`p-4 bg-white rounded hover:bg-black/5 duration-300 justify-between items-center`}
        >
          <Column>
            <p className="font-semibold text-lg">{transaction?.description}</p>
            <span className="text-xs">
              <DateFormatter>{transactionDate}</DateFormatter>
            </span>
          </Column>
          <Column>
            <p
              className={`text-xl text-end ${
                isIncomingValue ? "text-green-600" : "text-red-600"
              }  font-medium`}
            >
              <CurrencyFormatter>{transaction.value}</CurrencyFormatter>
            </p>
            <span className="text-xs text-end">no cartão Nubank</span>
          </Column>
        </Row>
      }
    />
  );
}
