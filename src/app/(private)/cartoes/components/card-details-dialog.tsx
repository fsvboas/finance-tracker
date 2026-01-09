"use client";

import Card from "@/src/app/(private)/cartoes/components/card";
import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import TransactionCard from "@/src/app/(private)/transacoes/components/transaction-card";
import { getTransactions } from "@/src/app/(private)/transacoes/services";
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
import { useUserSecrets } from "@/src/providers/user-secrets-provider";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

interface CardFormDialogProps {
  trigger: React.ReactNode;
  card: CardType;
}

const CardDetailsDialog = ({ trigger, card }: CardFormDialogProps) => {
  const { credentials } = useUserSecrets();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dueDate = card?.dueDate?.toString();
  const isCreditCard = card?.type === "credit";

  const { data, isPending } = useQuery({
    queryFn: () =>
      getTransactions({
        userSecrets: credentials!,
        cardId: card.id,
      }),
    queryKey: ["card-transactions", card.id, credentials],
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const cardTransactions = useMemo(() => data || [], [data]);

  const totalSpent = useMemo(() => {
    return cardTransactions.reduce((sum, transaction) => {
      return sum + Number(transaction.value);
    }, 0);
  }, [cardTransactions]);

  const availableLimit = useMemo(() => {
    if (!isCreditCard) return 0;
    const limit = Number(card.creditLimit);
    return limit - totalSpent;
  }, [isCreditCard, card.creditLimit, totalSpent]);

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
                  <dt>Gasto:</dt>
                  <dd className="font-semibold text-red-600">
                    <CurrencyFormatter>{String(totalSpent)}</CurrencyFormatter>
                  </dd>
                </Row>
                <Row className="gap-2">
                  <dt>Disponível:</dt>
                  <dd className="font-semibold text-green-600">
                    <CurrencyFormatter>
                      {String(availableLimit)}
                    </CurrencyFormatter>
                  </dd>
                </Row>
              </Show>
            </dl>
          </Flex>
        </DialogHeader>
        <Column className="h-100 overflow-y-auto gap-2">
          <Show
            when={!isPending && cardTransactions.length > 0}
            fallback={
              <div className="text-center text-gray-500 py-8">
                {isPending ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
                    <p>Carregando transações...</p>
                  </div>
                ) : (
                  <p>Nenhuma transação encontrada</p>
                )}
              </div>
            }
          >
            {cardTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                showActionButtons={false}
              />
            ))}
          </Show>
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsDialog;
