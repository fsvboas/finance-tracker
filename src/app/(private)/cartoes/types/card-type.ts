export type CardType = {
  id: string;
  name: string;
  type: "credit" | "debit";
  creditLimit?: string;
  dueDate: Date;
  color?: string;
};

export type CardRequestType = Omit<CardType, "id">;
