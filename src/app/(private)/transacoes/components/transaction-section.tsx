"use client";

import { Button } from "@/src/components/button";
import { ScrollArea } from "@/src/components/scroll-area";
import { Skeleton } from "@/src/components/skeleton";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { TransactionFiltersType } from "@/src/types/transaction-filters-type";
import { TransactionType } from "@/src/types/transaction-type";
import { ListPlus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import AddTransactionFormDialog from "./add-transaction-form-dialog";
import EmptyTransactionHistory from "./empty-transaction-history";
import TransactionCard from "./transaction-card";
import TransactionTypeFilterSelectInput from "./transaction-type-filter-select-input";

interface TransactionSectionProps {
  transactions: TransactionType[];
  pending: boolean;
  totalIncome: number;
  selectedMonth: number;
  filter: TransactionFiltersType;
  setFilter: Dispatch<SetStateAction<TransactionFiltersType>>;
}

const TransactionSection = ({
  transactions,
  pending,
  totalIncome,
  selectedMonth,
  filter,
  setFilter,
}: TransactionSectionProps) => {
  const pendingData = Array.from({ length: 4 }, (_, index) => (
    <Skeleton key={index} className="w-full h-20" />
  ));

  return (
    <Column className="w-full h-full mb-2 items-center">
      <Row className="justify-between w-full h-10 my-2 items-center max-[1020px]:px-2">
        <Show
          when={!pending}
          fallback={
            <Row className="w-full justify-between space-x-2">
              <Skeleton className="w-1/2 sm:max-w-34 h-9 rounded" />
              <Skeleton className="w-1/2 sm:max-w-37 h-9 rounded" />
            </Row>
          }
        >
          <AddTransactionFormDialog
            selectedMonth={selectedMonth}
            trigger={
              <Button variant="link" className="cursor-pointer px-0 h-full">
                <Row className="items-center space-x-1.5 h-full">
                  <ListPlus className="!w-5 !h-5" />
                  <span>Nova Transação</span>
                </Row>
              </Button>
            }
          />
          <TransactionTypeFilterSelectInput
            value={filter}
            onChange={(newValue) =>
              setFilter(newValue as TransactionFiltersType)
            }
          />
        </Show>
      </Row>
      <ScrollArea className="w-full mb-4">
        <Column className="space-y-2 h-full md:max-h-109">
          <Show when={!pending} fallback={pendingData}>
            <Show
              when={transactions.length > 0}
              fallback={
                <EmptyTransactionHistory selectedMonth={selectedMonth} />
              }
            >
              {transactions.map((transaction, index) => (
                <TransactionCard
                  key={index}
                  transaction={transaction}
                  totalIncome={totalIncome}
                />
              ))}
            </Show>
          </Show>
        </Column>
      </ScrollArea>
      <Show when={transactions.length > 0}>
        <AddTransactionFormDialog
          selectedMonth={selectedMonth}
          trigger={
            <Button className="cursor-pointer w-fit max-md:hidden">
              <ListPlus className="!w-5 !h-5" />
              Nova Transação
            </Button>
          }
        />
      </Show>
    </Column>
  );
};

export default TransactionSection;
