"use client";

import Card from "@/src/app/(private)/cartoes/components/card";
import CardTransactionHistoryTable from "@/src/app/(private)/cartoes/components/card-transaction-history-table";
import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/src/components/core/dialog";
import Flex from "@/src/components/core/flex";
import Row from "@/src/components/core/row";
import Show from "@/src/components/core/show";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

interface CardFormDialogProps {
  trigger: React.ReactNode;
  card: CardType;
}

const CardDetailsDialog = ({ trigger, card }: CardFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dueDate = card?.dueDate?.toString();

  const isCreditCard = card?.type === "credit";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
          <Flex className="flex-row justify-between items-center">
            <div className="w-full max-w-60">
              <Card card={card} showActionButtons={false} />
            </div>
            <dl className="flex flex-col gap-2">
              <Row className="gap-2">
                <dt>Data de Vencimento:</dt>
                <dd className="font-semibold">
                  <DateFormatter>{dueDate}</DateFormatter>
                </dd>
              </Row>
              <Show when={isCreditCard}>
                <Row className="gap-2">
                  <dt>Limite do cartão:</dt>
                  <dd className="font-semibold">
                    <CurrencyFormatter>{card?.creditLimit}</CurrencyFormatter>
                  </dd>
                </Row>
                <Row className="gap-2">
                  <dt>Limite disponível:</dt>
                  <dd className="font-semibold">
                    <CurrencyFormatter>{card?.creditLimit}</CurrencyFormatter>
                  </dd>
                </Row>
              </Show>
            </dl>
          </Flex>
        </DialogHeader>
        <CardTransactionHistoryTable />
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsDialog;
