import { CircleSlash2 } from "lucide-react";
import AddTransactionFormDialog from "./add-transaction-form-dialog";
import { Button } from "./ui/button";
import Column from "./utils/column";

const EmptyTransactionHistory = () => {
  return (
    <Column className="p-6 bg-white h-full w-full items-center justify-center rounded space-y-4">
      <CircleSlash2 size={40} />
      <p className="text-center">Nenhuma transação foi adicionada neste mês.</p>
      <AddTransactionFormDialog
        trigger={<Button className="cursor-pointer">Nova Transação</Button>}
      />
    </Column>
  );
};

export default EmptyTransactionHistory;
