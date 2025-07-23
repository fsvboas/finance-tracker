type CurrencyFormatType = {
  children: number | string | undefined;
};

const currencyFormat = (value?: number) => {
  if (!value) return "R$ 0,00";
  return (
    `R$ ` +
    new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  );
};

const CurrencyFormat = ({ children }: CurrencyFormatType) => {
  return <>{currencyFormat(Number(children))}</>;
};

export default CurrencyFormat;
