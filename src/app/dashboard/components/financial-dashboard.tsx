"use client";

import { checkPinExists, getTransactions } from "@/src/app/dashboard/services";
import UserPinFormDialog from "@/src/components/user-pin-form-dialog";
import Column from "@/src/components/utils/column";
import Show from "@/src/components/utils/show";
import { useAuth } from "@/src/hooks/use-auth";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { TransactionFiltersType } from "@/src/types/transaction-filters-type";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import FinancialSummary from "./financial-summary";
import TimePeriodSelector from "./time-period-selector";
import TransactionSection from "./transaction-section";

export default function FinancialDashboard() {
  const { credentials } = useUserSecrets();
  const { user, loading: authLoading } = useAuth();

  const getCurrentMonth = new Date().getMonth() + 1;
  const getCurrentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number>(getCurrentMonth);
  const [year, setYear] = useState<number>(getCurrentYear);
  const [filter, setFilter] = useState<TransactionFiltersType>("all");

  const { data: pinExists, isPending: pendingCheckPinExists } = useQuery({
    queryFn: () => checkPinExists({ userId: user?.id }),
    queryKey: ["pin-exists", user?.id],
    enabled: !!user?.id,
    staleTime: Infinity,
  });

  const { data, isPending: pendingGetTransactions } = useQuery({
    queryFn: () => getTransactions({ userSecrets: credentials! }),
    queryKey: ["transactions", credentials],
    enabled: Boolean(credentials),
    staleTime: 15 * 60 * 1000,
    gcTime: 45 * 60 * 1000,
  });

  const userPinFormDialogMode = pinExists ? "validate" : "create";

  const transactions = useMemo(() => data || [], [data]);

  const transactionsByDate = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      return transactionMonth === month && transactionYear === year;
    });
  }, [month, year, transactions]);

  const filteredTransactions = useMemo(() => {
    return transactionsByDate.filter((transaction) => {
      return filter === "all" || transaction.type === filter;
    });
  }, [transactionsByDate, filter]);

  const financialSummary = useMemo(() => {
    const totalIncome = transactionsByDate.reduce((sum, transaction) => {
      return transaction.type === "income"
        ? sum + Number(transaction.value)
        : sum;
    }, 0);

    const totalExpense = transactionsByDate.reduce((sum, transaction) => {
      return transaction.type === "expense"
        ? sum + Number(transaction.value)
        : sum;
    }, 0);

    const totalInvestment = transactionsByDate.reduce((sum, transaction) => {
      return transaction.type === "investment"
        ? sum + Number(transaction.value)
        : sum;
    }, 0);

    return {
      totalIncome,
      totalExpense,
      totalInvestment,
      total: totalIncome - totalExpense - totalInvestment,
    };
  }, [transactionsByDate]);

  if (authLoading || !user) return null;

  return (
    <Column className="items-center h-fit w-full space-y-2 max-w-5xl mx-auto mt-16">
      <Show when={!pendingCheckPinExists}>
        <Show when={user}>
          <UserPinFormDialog userId={user.id} mode={userPinFormDialogMode} />
        </Show>
      </Show>
      <TimePeriodSelector
        selectedYear={year}
        setSelectedYear={setYear}
        selectedMonth={month}
        setSelectedMonth={setMonth}
      />
      <FinancialSummary
        totalIncome={financialSummary.totalIncome}
        totalExpense={financialSummary.totalExpense}
        totalInvestment={financialSummary.totalInvestment}
        total={financialSummary.total}
        pending={pendingGetTransactions}
      />
      <TransactionSection
        transactions={filteredTransactions}
        pendingTransactions={pendingGetTransactions}
        totalIncome={financialSummary.totalIncome}
        selectedMonth={month}
        filter={filter}
        setFilter={setFilter}
      />
    </Column>
  );
}
