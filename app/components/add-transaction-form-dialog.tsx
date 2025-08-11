import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { queryClient } from "../libs/tanstack-query";
import { postTransaction } from "../services/post-transaction";
import { TransactionType } from "../types/transaction-type";
import { Button } from "./ui/button";
import DatePicker from "./ui/date-picker";
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
import Show from "./utils/show";

interface AddTransactionFormDialogProps {
  trigger: React.ReactNode;
}

const AddTransactionFormDialog = ({
  trigger,
}: AddTransactionFormDialogProps) => {
  const { control, handleSubmit } = useForm<TransactionType>({
    defaultValues: {
      transactionType: "incoming",
      description: "",
      value: "",
      date: new Date(),
    },
  });

  const { mutate: post, isPending: pendingPostTransaction } = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      // TO-DO: TOAST
      console.log(error);
    },
  });

  const handleAddTransaction = (transaction: TransactionType) => {
    post({ transaction });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form
          id="transaction-form"
          onSubmit={handleSubmit(handleAddTransaction)}
          className="space-y-3"
        >
          <DialogHeader>
            <DialogTitle />
            <Controller
              name="transactionType"
              control={control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="items-center"
                >
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
              )}
            />
          </DialogHeader>
          <Column className="space-y-2">
            <Label htmlFor="transaction">Transação</Label>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  id="transaction"
                  placeholder="Salário"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Column>
          <Flex className="min-[500px]:space-x-2 max-[500px]:flex-col max-[500px]:space-y-4">
            <Column className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Controller
                name="value"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    id="value"
                    placeholder="R$ 2.000,00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Column>
            <Controller
              name="date"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  value={value}
                  onValueChange={(date) => onChange(date)}
                />
              )}
            />
          </Flex>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="hover:cursor-pointer" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={pendingPostTransaction}
            >
              <Show when={pendingPostTransaction}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionFormDialog;
