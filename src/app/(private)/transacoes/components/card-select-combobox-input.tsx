import { getCards } from "@/src/app/(private)/cartoes/services";
import { Button } from "@/src/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/popover";
import { cn } from "@/src/libs/shadcn-ui/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface CardSelectInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error: boolean;
}

const CardSelectInput = ({
  value,
  onChange,
  disabled,
  error,
}: CardSelectInputProps) => {
  const [open, setOpen] = useState(false);

  const { data, isPending: pendingGetCards } = useQuery({
    queryFn: getCards,
    queryKey: ["cards"],
  });

  const cards = data || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between text-base ${
            error ? "border-red-500" : ""
          } font-normal`}
          disabled={disabled}
        >
          {value || "Selecione um cartão..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Busque um cartão" className="h-9" />
          <CommandList>
            <CommandEmpty>Cartão não encontrado.</CommandEmpty>
            <CommandGroup>
              {cards?.map((card) => (
                <CommandItem
                  key={card?.id}
                  value={card?.card_name}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {card?.card_name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === card?.card_name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CardSelectInput;
