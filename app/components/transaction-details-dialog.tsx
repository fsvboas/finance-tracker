import CurrencyFormatter from "../helpers/currency-formatter";
import DateFormatter from "../helpers/date-formatter";
import { TransactionType } from "../types/transaction-type";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Column from "./utils/column";
import Row from "./utils/row";

interface TransactionDetailsDialog {
  trigger: React.ReactNode;
  transaction: TransactionType;
}

const TransactionDetailsDialog = ({
  trigger,
  transaction,
}: TransactionDetailsDialog) => {
  const handleDeleteTransaction = (transactionId: string) => {
    alert(`Delete Transaction ${transactionId}`);
  };

  const hasTransactionTimeMock = true;

  const transactionTypeTranslation = {
    incoming: "Entrada",
    outcoming: "Saída",
  } as const;

  const transactionDate = new Date(transaction.date).toISOString();

  return (
    <Dialog>
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
              <dt className="font-medium">Tipo de Transação:</dt>
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
              <dt className="font-medium">Valor:</dt>
              <dd>
                <CurrencyFormatter>{transaction.value}</CurrencyFormatter>
              </dd>
            </Row>
            <Row className="space-x-2">
              <dt className="font-medium">Dia:</dt>
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
            onClick={() => handleDeleteTransaction(transaction.id)}
          >
            Remover Transação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
