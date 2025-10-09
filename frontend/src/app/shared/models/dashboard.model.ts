import { Card } from "./card.model";

export interface Dashboard {
  id: number;
  name: string;
  created_at: string;
  cards: Card[];
}
