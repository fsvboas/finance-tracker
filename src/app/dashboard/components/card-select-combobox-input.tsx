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
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface CardSelectInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const CardSelectInput = ({
  value,
  onChange,
  disabled,
}: CardSelectInputProps) => {
  const [open, setOpen] = useState(false);

  const cards = [
    "Nubank",
    "PicPay",
    "Banco do Brasil",
    "Caixa Econômica Federal",
    "Bradesco",
    "Itaú",
    "Santander",
    "Banco Inter",
    "C6 Bank",
    "Mercado Pago",
    "PagBank (PagSeguro)",
    "Next",
    "Original",
    "BTG Pactual",
    "Sicoob",
    "Sicredi",
    "Banco Pan",
    "BMG",
    "Neon",
    "Banrisul",
    "Banco Safra",
    "Stone",
    "ModalMais",
    "LATAM",
    "Renner",
    "C&A",
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
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
              {cards.map((card) => (
                <CommandItem
                  key={card}
                  value={card}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {card}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === card ? "opacity-100" : "opacity-0"
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
