import { Button } from "@/src/components/button";
import Column from "@/src/components/utils/column";
import { CircleSlash2, ListPlus } from "lucide-react";
import AddTransactionFormDialog from "./add-transaction-form-dialog";

const EmptyTransactionHistory = () => {
  return (
    <Column className="p-6 bg-neutral-100 h-full max-h-90 w-full items-center justify-center rounded space-y-4">
      <CircleSlash2 size={40} />
      <p className="text-center">Nenhuma transação foi adicionada neste mês.</p>
      <AddTransactionFormDialog
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
