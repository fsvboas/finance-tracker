"use client";

import Card from "@/src/app/(private)/cartoes/components/card";
import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import TransactionCard from "@/src/app/(private)/transacoes/components/transaction-card";
import { TransactionType } from "@/src/app/(private)/transacoes/types/transaction-type";
import Badge from "@/src/components/badge";
import Column from "@/src/components/core/column";
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

  const mockCardHistory: TransactionType[] = [
    {
      id: "1",
      description: "Compra no Supermercado Extra",
      value: "23450",
      type: "expense",
      created_at: "2024-01-05T14:32:00",
      payment_method: "credit_card",
    },
    {
      id: "2",
      description: "Netflix - Assinatura Mensal",
      value: "4490",
      type: "expense",
      created_at: "2024-01-04T09:15:00",
      payment_method: "credit_card",
    },
    {
      id: "3",
      description: "Posto Shell - Combustível",
      value: "18900",
      type: "expense",
      created_at: "2024-01-03T18:45:00",
      payment_method: "credit_card",
    },
    {
      id: "4",
      description: "iFood - Restaurante Japonês",
      value: "8730",
      type: "expense",
      created_at: "2024-01-02T20:10:00",
      payment_method: "credit_card",
    },
    {
      id: "5",
      description: "Amazon - Livros",
      value: "15680",
      type: "expense",
      created_at: "2024-01-01T11:25:00",
      payment_method: "credit_card",
    },
    {
      id: "6",
      description: "Farmácia São Paulo",
      value: "6745",
      type: "expense",
      created_at: "2023-12-30T16:50:00",
      payment_method: "credit_card",
    },
    {
      id: "7",
      description: "Uber - Corrida",
      value: "2390",
      type: "expense",
      created_at: "2023-12-29T22:30:00",
      payment_method: "credit_card",
    },
    {
      id: "8",
      description: "Spotify - Assinatura Premium",
      value: "2190",
      type: "expense",
      created_at: "2023-12-28T08:00:00",
      payment_method: "credit_card",
    },
    {
      id: "9",
      description: "Zara - Roupas",
      value: "34500",
      type: "expense",
      created_at: "2023-12-27T15:20:00",
      payment_method: "credit_card",
    },
    {
      id: "10",
      description: "Padaria Dona Maria",
      value: "4215",
      type: "expense",
      created_at: "2023-12-26T07:30:00",
      payment_method: "credit_card",
    },
  ];
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Badge text="Em desenvolvimento" />
          </DialogTitle>
          <Flex className="flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="w-full sm:max-w-60">
              <Card card={card} showActionButtons={false} />
            </div>
            <dl className="flex flex-col gap-2">
              <Row className="gap-2">
                <dt>Vencimento:</dt>
                <dd className="font-semibold">
                  <DateFormatter>{dueDate}</DateFormatter>
                </dd>
              </Row>
              <Show when={isCreditCard}>
                <Row className="gap-2">
                  <dt>Limite:</dt>
                  <dd className="font-semibold">
                    <CurrencyFormatter>{card?.creditLimit}</CurrencyFormatter>
                  </dd>
                </Row>
                <Row className="gap-2">
                  <dt>Disponível:</dt>
                  <dd className="font-semibold">
                    <CurrencyFormatter>{card?.creditLimit}</CurrencyFormatter>
                  </dd>
                </Row>
              </Show>
            </dl>
          </Flex>
        </DialogHeader>
        <Column className="h-100 overflow-y-auto gap-2">
          {mockCardHistory.map((transaction, index) => (
            <TransactionCard
              key={index}
              transaction={transaction}
              showActionButtons={false}
            />
          ))}
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsDialog;
