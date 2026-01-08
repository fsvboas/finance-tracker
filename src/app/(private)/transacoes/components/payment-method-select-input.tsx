import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/core/select";

interface PaymentMethodSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelectInput = ({
  value,
  onChange,
}: PaymentMethodSelectInputProps) => {
  const paymentMethods = [
    {
      label: "Dinheiro",
      value: "cash",
    },
    {
      label: "Pix",
      value: "pix",
    },
    {
      label: "Cartão",
      value: "card",
    },
    {
      label: "Boleto",
      value: "bank-slip",
    },
    {
      label: "Vale Refeição",
      value: "meal voucher",
    },
    {
      label: "Vale Alimentação",
      value: "food-voucher",
    },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-base">
        <SelectValue placeholder="Dinheiro" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {paymentMethods.map((paymentMethod, index) => (
            <SelectItem key={index} value={paymentMethod?.value}>
              {paymentMethod?.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PaymentMethodSelectInput;
