import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/core/select";

interface CardTypeSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CardTypeSelectInput = ({ value, onChange }: CardTypeSelectInputProps) => {
  const cardTypeOptions = [
    { label: "Débito", value: "debit" },
    { label: "Crédito", value: "credit" },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-base">
        <SelectValue placeholder="Débito" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {cardTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CardTypeSelectInput;
