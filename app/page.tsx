import Card from "./components/financial-summary-card";
import FinancialTable from "./components/financial-table";
import Column from "./components/utils/column";
import Flex from "./components/utils/flex";
import { InvoiceType } from "./types/invoice-type";

export default function Home() {
  const incomings = 100000;
  const outcomings = 50000;
  const total = incomings - outcomings;

  return (
    <Column className="min-h-screen w-full flex bg-black/95 items-center justify-center">
      <Column className="items-center space-y-2 w-full max-w-2xl">
        <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center">
          <Card title="Entradas" value={incomings} />
          <Card title="Saídas" value={outcomings} />
          <Card title="Total" value={total} />
        </Flex>
        <FinancialTable data={mockDataTable} />
      </Column>
    </Column>
  );
}

const mockDataTable: InvoiceType[] = [
  {
    description: "Salário",
    value: 500000,
    invoiceType: "incoming",
    date: "05/07/2025",
  },
  {
    description: "Aluguel",
    value: 100000,
    invoiceType: "outcoming",
    date: "05/07/2025",
  },
  {
    description: "Condomínio",
    value: 50000,
    invoiceType: "outcoming",
    date: "10/07/2025",
  },
  {
    description: "Mercado",
    value: 30000,
    invoiceType: "outcoming",
    date: "20/07/2025",
  },
];
