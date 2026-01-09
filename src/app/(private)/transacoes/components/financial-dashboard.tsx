"use client";

import {
  checkPinExists,
  getTransactions,
} from "@/src/app/(private)/transacoes/services";
import { TransactionFiltersType } from "@/src/app/(private)/transacoes/types/transaction-filters-type";
import { Container } from "@/src/components/core/container";
import Show from "@/src/components/core/show";
import UserPinFormDialogDrawer from "@/src/components/user-pin-form-dialog-drawer";
import { useAuth } from "@/src/hooks/use-auth";
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
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
    <Container variant="page">
      <Show when={!pendingCheckPinExists}>
        <Show when={user}>
          <UserPinFormDialogDrawer
            userId={user.id}
            mode={userPinFormDialogMode}
          />
        </Show>
      </Show>
      <TimePeriodSelector
        selectedYear={year}
        setSelectedYear={setYear}
        selectedMonth={month}
        setSelectedMonth={setMonth}
        pending={pendingGetTransactions}
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
        selectedMonth={month}
        filter={filter}
        setFilter={setFilter}
        pending={pendingGetTransactions}
      />
    </Container>
  );
}
