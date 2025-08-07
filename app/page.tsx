"use client";

import { ListPlus, ListRestart } from "lucide-react";
import { useMemo, useState } from "react";
import AddTransactionDialog from "./components/add-transaction-dialog";
import EmptyTransactionHistory from "./components/empty-transaction-history";
import Card from "./components/financial-summary-card";
import FinancialTable from "./components/financial-table";
import MonthlyButtonGroup from "./components/monthly-button-group";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import Column from "./components/utils/column";
import Flex from "./components/utils/flex";
import Row from "./components/utils/row";
import Show from "./components/utils/show";
import { TransactionType } from "./types/transaction-type";

export default function Home() {
  const getCurrentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState<number>(getCurrentMonth);

  const filteredTransactions = useMemo(() => {
    return mockDataTable.filter((transaction) => {
      const transactionMonth = transaction.date.getMonth() + 1;
      return transactionMonth === month;
    });
  }, [month]);

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
        <MonthlyButtonGroup selectedMonth={month} setSelectedMonth={setMonth} />
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

const mockDataTable: TransactionType[] = [
  {
    id: "1",
    description: "Salário",
    value: 500000,
    transactionType: "incoming",
    date: new Date("2025-07-05"),
  },
  {
    id: "2",
    description: "Gasolina",
    value: 30000,
    transactionType: "outcoming",
    date: new Date("2025-07-05"),
  },
  {
    id: "3",
    description: "Plano de Saúde",
    value: 60000,
    transactionType: "outcoming",
    date: new Date("2025-08-10"),
  },
  {
    id: "4",
    description: "Freelance",
    value: 200000,
    transactionType: "incoming",
    date: new Date("2025-08-15"),
  },
  {
    id: "5",
    description: "Mochila de Viagem",
    value: 25000,
    transactionType: "outcoming",
    date: new Date("2025-09-19"),
  },
  {
    id: "6",
    description: "Aluguel",
    value: 100000,
    transactionType: "outcoming",
    date: new Date("2025-10-23"),
  },
  {
    id: "7",
    description: "Condomínio",
    value: 50000,
    transactionType: "outcoming",
    date: new Date("2025-11-23"),
  },
  {
    id: "8",
    description: "Mercado",
    value: 30000,
    transactionType: "outcoming",
    date: new Date("2025-11-28"),
  },
];
