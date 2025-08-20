import { Button } from "@/src/components/button";
import Column from "@/src/components/utils/column";
import { CircleSlash2, ListPlus } from "lucide-react";
import AddTransactionFormDialog from "./add-transaction-form-dialog";

interface EmptyTransactionHistoryProps {
  selectedMonth: number;
}

const EmptyTransactionHistory = ({
  selectedMonth,
}: EmptyTransactionHistoryProps) => {
  return (
    <Column className="p-6 bg-neutral-100 dark:bg-[#202020] h-full w-full items-center justify-center rounded space-y-4">
      <CircleSlash2 size={40} />
      <p className="text-center">Nenhuma transação foi adicionada neste mês.</p>
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
