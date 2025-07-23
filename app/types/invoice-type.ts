export type InvoiceType = {
  description: string;
  value: number;
  invoiceType: "incoming" | "outcoming";
  date: string;
};
