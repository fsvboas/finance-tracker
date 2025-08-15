"use client";

import { deleteTransaction } from "@/src/app/dashboard/services";
import { Button } from "@/src/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/dialog";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { useUserSecrets } from "@/src/contexts/user-secrets-context";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";
import { queryClient } from "@/src/libs/tanstack-query";
import { TransactionType } from "@/src/types/transaction-type";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TransactionDetailsDialog {
  trigger: React.ReactNode;
  transaction: TransactionType;
}

const TransactionDetailsDialog = ({
  trigger,
  transaction,
}: TransactionDetailsDialog) => {
  const { credentials } = useUserSecrets();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const transactionTypeTranslation = {
    incoming: "Entrada",
    outcoming: "Saída",
  } as const;

  const transactionDate = new Date(transaction.created_at).toISOString();

  const { mutate: del, isPending: pendingDeleteTransaction } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (_, variables) => {
      queryClient?.invalidateQueries({ queryKey: ["transactions"] });
      setIsOpen(false);
      toast.success(
        `Transação ${variables.transaction.description}" removida com sucesso!`,
        {
          className: "!bg-green-600/80 !text-white",
        }
      );
    },
    onError: (error) => {
      // TO-DO: Translate error messages
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleDeleteTransaction = (transaction: TransactionType) => {
    del({ transaction, userSecrets: credentials! });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="overflow-hidden border-b-1 border-black/10">
          <DialogTitle className="overflow-hidden text-ellipsis pb-2">
            {transaction.description}
          </DialogTitle>
        </DialogHeader>
        <Column className="space-y-2">
          <dl className="space-y-2">
            <Row className="space-x-2">
              <dt className="font-semibold">Tipo de Transação:</dt>
              <dd
                className={`font-semibold  ${
                  transaction.transactionType === "incoming"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transactionTypeTranslation[transaction.transactionType]}
              </dd>
            </Row>
            <Row className="space-x-2">
              <dt className="font-semibold">Valor:</dt>
              <dd>
                <CurrencyFormatter>{transaction.value}</CurrencyFormatter>
              </dd>
            </Row>
            <Row className="space-x-2">
              <dt className="font-semibold">Dia:</dt>
              <dd>
                <DateFormatter>{transactionDate}</DateFormatter>
              </dd>
            </Row>
            {/* <Show when={hasTransactionTimeMock}>
              <Row className="space-x-2">
                <dt className="font-medium">Horário:</dt>
                <dd>10:30 AM</dd>
              </Row>
            </Show> */}
            {/* <Show when={transaction.transactionType === "outcoming"}>
              <Row className="space-x-2">
                <dt className="font-medium">Percentual das entradas:</dt>
                <dd>23%</dd>
              </Row>
            </Show> */}
          </dl>
        </Column>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            onClick={() => handleDeleteTransaction(transaction)}
            disabled={pendingDeleteTransaction}
          >
            <Show when={pendingDeleteTransaction}>
              <Loader2Icon className="animate-spin" />
            </Show>
            Remover Transação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
