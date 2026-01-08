import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/core/select";

interface RepeatTransactionSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RepeatTransactionSelectInput = ({
  value,
  onChange,
}: RepeatTransactionSelectInputProps) => {
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: i === 0 ? "Não repetir" : `${i + 1} meses`,
  }));

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-base">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {months.map((month, index) => (
            <SelectItem key={index} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RepeatTransactionSelectInput;
