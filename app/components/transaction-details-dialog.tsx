import { TransactionType } from "../types/transaction-type";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Column from "./utils/column";
import Row from "./utils/row";
import Show from "./utils/show";

interface TransactionDetailsDialog {
  trigger: React.ReactNode;
  transaction?: TransactionType;
}

const TransactionDetailsDialog = ({
  trigger,
  transaction,
}: TransactionDetailsDialog) => {
  const hasTransactionTimeMock = true;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction?.description}</DialogTitle>
        </DialogHeader>
        <Column className="space-y-2">
          {/* TO-DO: CREATE A BADGE TO SHOW TRANSACTION TYPE */}
          <dl className="space-y-2">
            <Row className="space-x-2">
              <dt className="font-medium">Tipo de Transação:</dt>
              <dd>{transaction?.transactionType}</dd>
            </Row>
            {/* TO-DO: CURRENCY (R$) FORMAT */}
            <Row className="space-x-2">
              <dt className="font-medium">Valor:</dt>
              <dd>{transaction?.value}</dd>
            </Row>
            <Row className="space-x-2">
              <dt className="font-medium">Dia:</dt>
              <dd>{transaction?.date?.toDateString()}</dd>
            </Row>
            <Show when={hasTransactionTimeMock}>
              <Row className="space-x-2">
                <dt className="font-medium">Horário:</dt>
                <dd>10:30 AM</dd>
              </Row>
              <Row className="space-x-2">
                <dt className="font-medium">Forma de Pagamento:</dt>
                <dd>Cartão Nubank</dd>
              </Row>
              <Row className="space-x-2">
                <dt className="font-medium">
                  Percentual correspondente às suas entradas:
                </dt>
                <dd>23%</dd>
              </Row>
            </Show>
          </dl>
        </Column>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="hover:cursor-pointer">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
