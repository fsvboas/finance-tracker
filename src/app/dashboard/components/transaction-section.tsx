"use client";

import { Button } from "@/src/components/button";
import { ScrollArea } from "@/src/components/scroll-area";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { TransactionType } from "@/src/types/transaction-type";
import { ListPlus, Loader2Icon } from "lucide-react";
import AddTransactionFormDialog from "./add-transaction-form-dialog";
import EmptyTransactionHistory from "./empty-transaction-history";
import TransactionCard from "./transaction-card";

interface TransactionSectionProps {
  transactions: TransactionType[];
  pendingTransactions: boolean;
}

export default function TransactionSection({
  transactions,
  pendingTransactions,
}: TransactionSectionProps) {
  return (
    <>
      <Row className="justify-between w-full h-10 items-center max-[1020px]:px-2">
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
          when={!pendingTransactions}
          fallback={
            // TO-DO: Create a pending component (maybe change to skeleton)
            <Column className="p-6 bg-white h-full w-full items-center justify-center rounded space-y-4">
              <Loader2Icon size={40} className="animate-spin" />
              <span className="text-center">Carregando transações</span>
            </Column>
          }
        >
          <Show
            when={transactions.length > 0}
            fallback={<EmptyTransactionHistory />}
          >
            <Column className="space-y-1">
              {transactions?.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction} />
              ))}
            </Column>
          </Show>
        </Show>
      </ScrollArea>
    </>
  );
}
