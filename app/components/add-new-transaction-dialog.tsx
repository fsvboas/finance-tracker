import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface AddNewTransactionDialogProps {
  trigger: React.ReactNode;
}

const AddNewTransactionDialog = ({ trigger }: AddNewTransactionDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>Dialog teste</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="hover:cursor-pointer">Adicionar</Button>
          <DialogClose asChild>
            <Button className="hover:cursor-pointer" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTransactionDialog;
