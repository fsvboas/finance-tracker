import { getCards } from "@/src/app/(private)/cartoes/services";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/core/select";
import { useQuery } from "@tanstack/react-query";

interface CardSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CardSelectInput = ({ value, onChange }: CardSelectInputProps) => {
  const { data, isPending: pendingGetCards } = useQuery({
    queryFn: getCards,
    queryKey: ["cards"],
  });

  const cards = data || [];

  console.log("@@cards", cards);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-base">
        <SelectValue placeholder="Selecione o cartão" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {cards?.map((card) => (
            <SelectItem key={card?.id} value={card?.id}>
              {card?.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CardSelectInput;
