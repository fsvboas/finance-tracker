export type CardType = {
  id: string;
  cardName: string;
  cardType: "credit" | "debit";
  cardLimit: number;
  cardDueDate: Date;
  cardColor?: string;
};

export type CardRequestType = Omit<CardType, "id">;
