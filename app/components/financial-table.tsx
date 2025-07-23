"use client";

import { Trash2 } from "lucide-react";
import CurrencyFormat from "../helpers/currency-format";
import { InvoiceType } from "../types/invoice-type";
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
  data?: InvoiceType[];
}

const FinancialTable = ({ data }: FinancialTableProps) => {
  const handleDeleteInvoice = (index: number) => {
    alert(`Delete Invoice ${index}`);
  };

  return (
    <Table className="bg-white rounded">
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => (
          <TableRow className="h-14" key={index}>
            {/* TO-DO: WRAP OR ELLIPSIS DESCRIPTION */}
            <TableCell className="w-1/2">{item?.description}</TableCell>
            <TableCell>
              <p
                className={`font-medium ${
                  item?.invoiceType === "incoming"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <CurrencyFormat>{item?.value}</CurrencyFormat>
              </p>
            </TableCell>
            <TableCell className="">{item?.date}</TableCell>
            <TableCell className="w-10">
              <Button
                className="cursor-pointer bg-transparent shadow-none hover:bg-red-100 text-neutral-300 hover:text-red-600 duration-200"
                onClick={() => handleDeleteInvoice(index)}
              >
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FinancialTable;
