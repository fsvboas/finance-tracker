"use client";

import { ListPlus, ListRestart } from "lucide-react";
import AddNewTransactionDialog from "./components/add-new-transaction-dialog";
import Card from "./components/financial-summary-card";
import FinancialTable from "./components/financial-table";
import { Button } from "./components/ui/button";
import Column from "./components/utils/column";
import Flex from "./components/utils/flex";
import Row from "./components/utils/row";
import { TransactionType } from "./types/transaction-type";

export default function Home() {
  const incomings = 100000;
  const outcomings = 50000;
  const total = incomings - outcomings;

  const handleClearTransactionList = () => alert("Clear Transaction List");

  return (
    <Column className="min-h-screen w-full flex bg-[#f4f2ee] items-center justify-center">
      <Column className="items-center space-y-2 w-full max-w-2xl">
        <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center">
          <Card title="Entradas" value={incomings} />
          <Card title="Saídas" value={outcomings} />
          <Card title="Total" value={total} />
        </Flex>
        <Row className="justify-between w-full h-10 items-center">
          <AddNewTransactionDialog
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
        <FinancialTable data={mockDataTable} />
      </Column>
    </Column>
  );
}

const mockDataTable: TransactionType[] = [
  {
    description: "Salário",
    value: 500000,
    transactionType: "incoming",
    date: "05/07/2025",
  },
  {
    description: "Aluguel",
    value: 100000,
    transactionType: "outcoming",
    date: "05/07/2025",
  },
  {
    description: "Condomínio",
    value: 50000,
    transactionType: "outcoming",
    date: "10/07/2025",
  },
  {
    description: "Mercado",
    value: 30000,
    transactionType: "outcoming",
    date: "20/07/2025",
  },
];
