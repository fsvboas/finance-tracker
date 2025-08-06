interface CurrencyFormatProps {
  children: number | string | undefined;
}

const currencyFormatter = (value: number) => {
  if (!value) return "R$0,00";
  return (
    `R$` +
    new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  );
};

const CurrencyFormatter = ({ children }: CurrencyFormatProps) => {
  return <>{currencyFormatter(Number(children))}</>;
};

export default CurrencyFormatter;
