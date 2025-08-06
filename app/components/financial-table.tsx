"use client";

import { Trash2 } from "lucide-react";
import CurrencyFormat from "../helpers/currency-format";
import { TransactionType } from "../types/transaction-type";
import TransactionDetailsDialog from "./transaction-details-dialog";
import { Button } from "./ui/button";
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
  const handleDeleteTransaction = (index: number) => {
    alert(`Delete Transaction ${index}`);
  };

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
          // TO-DO: Change date format
          const transactionDate = item?.date?.toDateString();
          return (
            <TransactionDetailsDialog
              transaction={item}
              key={index}
              trigger={
                <TableRow className="h-14">
                  {/* TO-DO: WRAP OR ELLIPSIS DESCRIPTION */}
                  <TableCell className="w-1/2">{item?.description}</TableCell>
                  <TableCell>
                    <p
                      className={`font-medium ${
                        item?.transactionType === "incoming"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <CurrencyFormat>{item?.value}</CurrencyFormat>
                    </p>
                  </TableCell>
                  <TableCell>{transactionDate}</TableCell>
                  <TableCell className="w-10">
                    <Button
                      className="cursor-pointer bg-transparent shadow-none hover:bg-red-100 text-neutral-300 hover:text-red-600 duration-200"
                      onClick={(event) => {
                        event.preventDefault();
                        handleDeleteTransaction(index);
                      }}
                    >
                      <Trash2 />
                    </Button>
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
