"use client";

import { useQuery } from "@tanstack/react-query";
import { ListPlus, ListRestart } from "lucide-react";
import { useMemo, useState } from "react";
import AddTransactionDialog from "./components/add-transaction-dialog";
import EmptyTransactionHistory from "./components/empty-transaction-history";
import Card from "./components/financial-summary-card";
import FinancialTable from "./components/financial-table";
import TimePeriodSelector from "./components/time-period-selector";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import Column from "./components/utils/column";
import Flex from "./components/utils/flex";
import Row from "./components/utils/row";
import Show from "./components/utils/show";
import { getTransactions } from "./services";

export default function Home() {
  const getCurrentMonth = new Date().getMonth() + 1;
  const getCurrentYear = new Date().getFullYear();
  const [month, setMonth] = useState<number>(getCurrentMonth);
  const [year, setYear] = useState<number>(getCurrentYear);

  // TO-DO: Pending state layout
  const { data, isPending: pendingGetTransactions } = useQuery({
    queryFn: () => getTransactions(),
    queryKey: ["transactions"],
  });

  const transactions = data || [];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();
      return transactionMonth === month && transactionYear === year;
    });
  }, [month, year]);

  const totalIncoming = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => {
      return transaction.transactionType === "incoming"
        ? sum + transaction.value
        : sum;
    }, 0);
  }, [filteredTransactions]);

  const totalOutcoming = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => {
      return transaction.transactionType === "outcoming"
        ? sum + transaction.value
        : sum;
    }, 0);
  }, [filteredTransactions]);

  const total = totalIncoming - totalOutcoming;

  const handleClearTransactionList = () => alert("Clear Transaction List");

  return (
    <Column className="min-h-screen w-full flex bg-[#f4f2ee] items-center sm:justify-center">
      <Column className="items-center space-y-2 w-full max-w-3xl">
        <TimePeriodSelector
          selectedYear={year}
          setSelectedYear={setYear}
          selectedMonth={month}
          setSelectedMonth={setMonth}
        />
        <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center">
          <Card title="Entradas" value={totalIncoming} />
          <Card title="Saídas" value={totalOutcoming} />
          <Card title="Disponível" value={total} />
        </Flex>
        <Row className="justify-between w-full h-10 items-center max-[780px]:px-2">
          <AddTransactionDialog
            trigger={
              <Button variant="link" className="cursor-pointer px-0 h-full">
                <Row className="items-center space-x-1.5 h-full">
                  <ListPlus className="!w-5 !h-5" />
                  <span>Nova Transação</span>
                </Row>
              </Button>
            }
          />
          <Button
            variant="link"
            className="cursor-pointer px-0"
            onClick={handleClearTransactionList}
          >
            <Row className="items-center space-x-1.5">
              <ListRestart className="!w-5 !h-5" />
              <span>Limpar Tabela</span>
            </Row>
          </Button>
        </Row>
        <ScrollArea className="w-full h-90">
          <Show
            when={filteredTransactions?.length > 0}
            fallback={<EmptyTransactionHistory />}
          >
            <FinancialTable data={filteredTransactions} />
          </Show>
        </ScrollArea>
      </Column>
    </Column>
  );
}
