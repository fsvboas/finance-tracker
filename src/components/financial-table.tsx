"use client";

import CurrencyFormatter from "../helpers/currency-formatter";
import DateFormatter from "../helpers/date-formatter";
import { TransactionType } from "../types/transaction-type";
import TransactionDetailsDialog from "./transaction-details-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface FinancialTableProps {
  data?: TransactionType[];
}

const FinancialTable = ({ data }: FinancialTableProps) => {
  return (
    <Table className="bg-white rounded">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => {
          const transactionDate = new Date(item?.date).toISOString();
          return (
            <TransactionDetailsDialog
              transaction={item}
              key={index}
              trigger={
                <TableRow className="h-14">
                  <TableCell className="max-w-[150px] md:max-w-[300px] overflow-x-hidden text-ellipsis">
                    {item?.description}
                  </TableCell>
                  <TableCell>
                    <p
                      className={`font-medium ${
                        item?.transactionType === "incoming"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <CurrencyFormatter>{item?.value}</CurrencyFormatter>
                    </p>
                  </TableCell>
                  <TableCell>
                    <DateFormatter>{transactionDate}</DateFormatter>
                  </TableCell>
                </TableRow>
              }
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

export default FinancialTable;
