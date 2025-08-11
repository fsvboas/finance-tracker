"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getTransactions } from "../services";

import FinancialSummary from "./financial-summary";
import TimePeriodSelector from "./time-period-selector";
import TransactionList from "./transaction-section";
import Column from "./utils/column";

export default function FinancialDashboard() {
  const getCurrentMonth = new Date().getMonth() + 1;
  const getCurrentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number>(getCurrentMonth);
  const [year, setYear] = useState<number>(getCurrentYear);

  const { data, isPending: pendingGetTransactions } = useQuery({
    queryFn: () => getTransactions(),
    queryKey: ["transactions"],
  });

  const transactions = useMemo(() => data || [], [data]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();
      return transactionMonth === month && transactionYear === year;
    });
  }, [month, year, transactions]);

  const financialSummary = useMemo(() => {
    const totalIncoming = filteredTransactions.reduce((sum, transaction) => {
      return transaction.transactionType === "incoming"
        ? sum + Number(transaction.value)
        : sum;
    }, 0);

    const totalOutcoming = filteredTransactions.reduce((sum, transaction) => {
      return transaction.transactionType === "outcoming"
        ? sum + Number(transaction.value)
        : sum;
    }, 0);

    return {
      totalIncoming,
      totalOutcoming,
      total: totalIncoming - totalOutcoming,
    };
  }, [filteredTransactions]);

  return (
    <Column className="items-center space-y-2 w-full">
      <TimePeriodSelector
        selectedYear={year}
        setSelectedYear={setYear}
        selectedMonth={month}
        setSelectedMonth={setMonth}
      />
      <FinancialSummary
        totalIncoming={financialSummary.totalIncoming}
        totalOutcoming={financialSummary.totalOutcoming}
        total={financialSummary.total}
      />
      <TransactionList transactions={filteredTransactions} />
    </Column>
  );
}
