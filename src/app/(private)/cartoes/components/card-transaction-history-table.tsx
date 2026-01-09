import { CardHistoryType } from "@/src/app/(private)/cartoes/types/card-history-type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/core/table";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import DateFormatter from "@/src/helpers/date-formatter";

interface CardTransactionHistoryTableProps {
  cardTransactionHistory?: CardHistoryType[];
}

const CardTransactionHistoryTable = ({
  cardTransactionHistory,
}: CardTransactionHistoryTableProps) => {
  const mockCardHistory: CardHistoryType[] = [
    {
      description: "Compra no Supermercado Extra",
      value: "23450",
      date: new Date("2024-01-05T14:32:00"),
    },
    {
      description: "Netflix - Assinatura Mensal",
      value: "4490",
      date: new Date("2024-01-04T09:15:00"),
    },
    {
      description: "Posto Shell - Combustível",
      value: "18900",
      date: new Date("2024-01-03T18:45:00"),
    },
    {
      description: "iFood - Restaurante Japonês",
      value: "8730",
      date: new Date("2024-01-02T20:10:00"),
    },
    {
      description: "Amazon - Livros",
      value: "15680",
      date: new Date("2024-01-01T11:25:00"),
    },
    {
      description: "Farmácia São Paulo",
      value: "6745",
      date: new Date("2023-12-30T16:50:00"),
    },
    {
      description: "Uber - Corrida",
      value: "2390",
      date: new Date("2023-12-29T22:30:00"),
    },
    {
      description: "Spotify - Assinatura Premium",
      value: "2190",
      date: new Date("2023-12-28T08:00:00"),
    },
    {
      description: "Zara - Roupas",
      value: "34500",
      date: new Date("2023-12-27T15:20:00"),
    },
    {
      description: "Padaria Dona Maria",
      value: "4215",
      date: new Date("2023-12-26T07:30:00"),
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead className="text-right">Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockCardHistory.map((cardTransaction, index) => (
          <TableRow key={index}>
            <TableCell>{cardTransaction?.description}</TableCell>
            <TableCell>
              <CurrencyFormatter>{cardTransaction?.value}</CurrencyFormatter>
            </TableCell>
            <TableCell className="text-right">
              <DateFormatter>
                {cardTransaction?.date?.toISOString()}
              </DateFormatter>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CardTransactionHistoryTable;
