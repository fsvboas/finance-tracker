import { CardType } from "@/src/app/cartoes/types/card-type";
import Column from "@/src/components/utils/column";
import Show from "@/src/components/utils/show";
import { CreditCard } from "lucide-react";

interface CardBox {
  card?: CardType;
  type: "new" | "all" | "card";
}

const CardBox = ({ card, type }: CardBox) => {
  const cardTypeTranslation = {
    credit: "Crédito",
    debit: "Débito",
  } as const;

  return (
    <div>
      <Show when={type === "new"}>
        <Column className="group border-2 rounded h-24 w-full min-w-48 border-dashed hover:border-white items-center justify-center duration-300 hover:cursor-pointer">
          <CreditCard
            size={48}
            className="text-border group-hover:text-white transition-colors duration-300"
          />
          <span className="text-center text-sm uppercase text-border group-hover:text-white transition-colors duration-300 font-medium">
            Novo Cartão
          </span>
        </Column>
      </Show>
      <Show when={type === "all"}>
        <Column
          className={`group h-24 min-w-48 w-full rounded hover:border-white dark:bg-[#202020] hover:opacity-80 items-center justify-center duration-300 hover:cursor-pointe p-2 cursor-pointer`}
        >
          <Column className="space-y-0 w-full">
            <span className="text-center text-base uppercase text-white transition-colors duration-300 font-bold">
              Resumo Geral
            </span>
            <span className="text-center text-white group-hover:text-white text-sm transition-colors duration-300">
              Crédito & Débito
            </span>
          </Column>
        </Column>
      </Show>
      <Show when={type === "card"}>
        <Column
          className={`group h-24 min-w-48 w-full rounded hover:border-white ${card?.color} hover:opacity-80 items-center justify-center duration-300 hover:cursor-pointe p-2 cursor-pointer`}
        >
          <Column className="space-y-0 w-full">
            <span className="text-center text-base uppercase text-white transition-colors duration-300 font-bold">
              {card?.name}
            </span>
            <span className="text-center text-white group-hover:text-white text-sm transition-colors duration-300">
              {card ? cardTypeTranslation[card?.type] : ""}
            </span>
          </Column>
        </Column>
      </Show>
    </div>
  );
};
export default CardBox;
