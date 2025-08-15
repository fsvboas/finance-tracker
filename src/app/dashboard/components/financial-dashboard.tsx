"use client";

import { checkPinExists, getTransactions } from "@/src/app/dashboard/services";
import { UserPinFormDialog } from "@/src/components/user-pin-form-dialog";
import Column from "@/src/components/utils/column";
import Show from "@/src/components/utils/show";
import { useUserSecrets } from "@/src/contexts/user-secrets-context";
import { useUser } from "@/src/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import FinancialSummary from "./financial-summary";
import TimePeriodSelector from "./time-period-selector";
import TransactionSection from "./transaction-section";

export default function FinancialDashboard() {
  const { credentials } = useUserSecrets();
  const user = useUser();

  const getCurrentMonth = new Date().getMonth() + 1;
  const getCurrentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number>(getCurrentMonth);
  const [year, setYear] = useState<number>(getCurrentYear);

  const { data: pinExists, isPending: pendingCheckPinExists } = useQuery({
    queryFn: () => checkPinExists({ userId: user?.id }),
    queryKey: ["pin-exists", user?.id],
    enabled: !!user?.id,
  });

  const { data, isPending: pendingGetTransactions } = useQuery({
    queryFn: () => getTransactions({ userSecrets: credentials! }),
    queryKey: ["transactions"],
  });

  const userPinFormDialogMode = pinExists ? "validate" : "create";

  const transactions = useMemo(() => data || [], [data]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
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

  if (!user) return;

  return (
    <Column className="items-center h-fit w-full space-y-2 max-w-5xl mx-auto mt-16 mb-8">
      <Show when={!pendingCheckPinExists}>
        <Show when={user}>
          <UserPinFormDialog userId={user!.id} mode={userPinFormDialogMode} />
        </Show>
      </Show>
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
        pending={pendingGetTransactions}
      />
      <TransactionSection
        transactions={filteredTransactions}
        pendingTransactions={pendingGetTransactions}
      />
    </Column>
  );
}
