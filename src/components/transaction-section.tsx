"use client";

import { ListPlus } from "lucide-react";
import { TransactionType } from "../types/transaction-type";
import AddTransactionFormDialog from "./add-transaction-form-dialog";
import EmptyTransactionHistory from "./empty-transaction-history";
import FinancialTable from "./financial-table";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import Row from "./utils/row";
import Show from "./utils/show";

interface TransactionSectionProps {
  transactions: TransactionType[];
}

export default function TransactionSection({
  transactions,
}: TransactionSectionProps) {
  return (
    <>
      <Row className="justify-between w-full h-10 items-center max-[780px]:px-2">
        <AddTransactionFormDialog
          trigger={
            <Button variant="link" className="cursor-pointer px-0 h-full">
              <Row className="items-center space-x-1.5 h-full">
                <ListPlus className="!w-5 !h-5" />
                <span>Nova Transação</span>
              </Row>
            </Button>
          }
        />
      </Row>
      <ScrollArea className="w-full h-90">
        <Show
          when={transactions?.length > 0}
          fallback={<EmptyTransactionHistory />}
        >
          <FinancialTable data={transactions} />
        </Show>
      </ScrollArea>
    </>
  );
}
