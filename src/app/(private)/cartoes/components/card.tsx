"use client";

import { deleteCard } from "@/src/app/(private)/cartoes/services";
import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import Row from "@/src/components/core/row";
import { queryClient } from "@/src/libs/tanstack-query/query-client";
import { useMutation } from "@tanstack/react-query";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CardProps {
  card: CardType;
}

const Card = ({ card }: CardProps) => {
  const { mutate: del, isPending: pendingDeleteCard } = useMutation({
    mutationFn: deleteCard,
    onSuccess: async (_, variables) => {
      await queryClient?.invalidateQueries({ queryKey: ["cards"] });
      toast.success(`Cartão "${variables.card.name}" removido com sucesso!`, {
        className: "!bg-green-600/80 !text-white",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        className: "!bg-red-600/80 !text-white",
      });
    },
  });

  const handleDeleteCard = (card: CardType) => {
    del({ card });
  };

  const cardTypeLabel =
    card.type === "credit"
      ? "crédito"
      : card.type === "debit"
      ? "débito"
      : card.type;

  return (
    <Column
      className="items-center justify-center border rounded-lg transition-opacity duration-300 p-4 w-full h-26 gap-2 text-white relative"
      style={{
        backgroundColor: "#181818",
      }}
    >
      <Column className="items-center">
        <p className="text-lg font-semibold capitalize truncate ellipsis text-white">
          {card.name}
        </p>
        <p className="capitalize text-sm">{cardTypeLabel}</p>
      </Column>
      <Row className="items-center gap-1 absolute -top-4 -right-2">
        <Button
          className="z-10 bg-white hover:bg-zinc-200 rounded-full p-0! cursor-pointer w-8 h-8 border"
          onClick={() => null}
        >
          <Eye className="text-zinc-800" />
        </Button>
        <Button
          className="z-10 bg-white hover:bg-zinc-200 rounded-full p-0! cursor-pointer w-8 h-8 border"
          onClick={() => null}
        >
          <Pencil className="text-zinc-800" />
        </Button>
        <Button
          className="z-10 bg-red-500 rounded-full p-0! hover:bg-red-600 cursor-pointer w-8 h-8"
          onClick={() => handleDeleteCard(card)}
        >
          <Trash2 className="text-white" />
        </Button>
      </Row>
    </Column>
  );
};

export default Card;
