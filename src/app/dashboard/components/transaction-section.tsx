"use client";

import { Button } from "@/src/components/button";
import { ScrollArea } from "@/src/components/scroll-area";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { TransactionType } from "@/src/types/transaction-type";
import { ListPlus } from "lucide-react";
import AddTransactionFormDialog from "./add-transaction-form-dialog";
import EmptyTransactionHistory from "./empty-transaction-history";
import TransactionCard from "./transaction-card";

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
          <Column className="space-y-1">
            {transactions?.map((transaction, index) => (
              <TransactionCard key={index} transaction={transaction} />
            ))}
          </Column>
        </Show>
      </ScrollArea>
    </>
  );
}
