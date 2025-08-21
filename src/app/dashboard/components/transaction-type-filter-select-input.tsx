import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/select";
import { FilterType } from "./transaction-section";

interface TransactionTypeFilterSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TransactionTypeFilterSelectInput = ({
  value,
  onChange,
}: TransactionTypeFilterSelectInputProps) => {
  const filters: FilterType[] = ["all", "income", "expense", "investment"];

  const filterLabels: Record<FilterType, string> = {
    all: "Tudo",
    income: "Entradas",
    expense: "Saídas",
    investment: "Investimentos",
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filters.map((filter, index) => (
            <SelectItem key={index} value={filter}>
              {filterLabels[filter]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TransactionTypeFilterSelectInput;
