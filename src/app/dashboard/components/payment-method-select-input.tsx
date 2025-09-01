import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/select";

interface PaymentMethodSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelectInput = ({
  value,
  onChange,
}: PaymentMethodSelectInputProps) => {
  const paymentMethods = [
    "Dinheiro",
    "Pix",
    "Cartão",
    "Boleto",
    "Vale Refeição",
    "Vale Alimentação",
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-base">
        <SelectValue placeholder="Dinheiro" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {paymentMethods.map((paymentMethod, index) => (
            <SelectItem key={index} value={paymentMethod}>
              {paymentMethod}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PaymentMethodSelectInput;
