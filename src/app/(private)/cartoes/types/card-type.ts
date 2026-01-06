export type CardType = {
  name: string;
  type: "credit" | "debit";
  limit: string;
  dueDate: string;
  closingDate: string;
  color: string;
};
