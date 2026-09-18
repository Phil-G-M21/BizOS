export type Product = {
  id: string;
  name: string;
  selling_price: number;
  cost_price: number;
  stock_quantity: number;
  category: string | null;
};

export const LOW_STOCK_THRESHOLD = 5;

export const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();
