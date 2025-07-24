import { Button } from "./ui/button";
import { DatePicker } from "./ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import Column from "./utils/column";
import Flex from "./utils/flex";

interface AddNewTransactionDialogProps {
  trigger: React.ReactNode;
}

const AddNewTransactionDialog = ({ trigger }: AddNewTransactionDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
          <Tabs defaultValue="incoming" className="items-center">
            <TabsList className="w-[80%] sm:w-1/2">
              <TabsTrigger
                className="text-green-600 hover:cursor-pointer"
                value="incoming"
              >
                Entrada
              </TabsTrigger>
              <TabsTrigger
                className="text-red-600 hover:cursor-pointer"
                value="outcoming"
              >
                Saída
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        <Column className="space-y-2">
          <Label htmlFor="transaction">Transação</Label>
          <Input id="transaction" />
        </Column>
        <Flex className="sm:space-x-2 max-sm:flex-col max-sm:space-y-4">
          <Column className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            <Input id="value" />
          </Column>
          <DatePicker />
        </Flex>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="hover:cursor-pointer" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button className="hover:cursor-pointer">Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTransactionDialog;
