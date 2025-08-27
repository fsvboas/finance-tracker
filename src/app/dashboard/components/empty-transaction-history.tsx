import { Button } from "@/src/components/button";
import Column from "@/src/components/utils/column";
import { ListPlus, ListX } from "lucide-react";
import AddTransactionFormDialog from "./add-transaction-form-dialog";

interface EmptyTransactionHistoryProps {
  selectedMonth: number;
}

const EmptyTransactionHistory = ({
  selectedMonth,
}: EmptyTransactionHistoryProps) => {
  return (
    <Column className="p-6 bg-neutral-100 dark:bg-[#202020] h-full w-full items-center justify-center rounded space-y-3">
      <Column className="items-center">
        <ListX size={48} />
        <p className="text-center text-sm sm:text-base">
          Nenhuma transação encontrada
        </p>
      </Column>
      <AddTransactionFormDialog
        selectedMonth={selectedMonth}
        trigger={
          <Button className="cursor-pointer">
            <ListPlus className="!w-5 !h-5" />
            Nova Transação
          </Button>
        }
      />
    </Column>
  );
};

export default EmptyTransactionHistory;
