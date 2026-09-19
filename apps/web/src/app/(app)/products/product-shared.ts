export type Product = {
  id: string;
  name: string;
  selling_price: number;
  cost_price: number;
  stock_quantity: number;
  category: string | null;
  sku?: string | null;
  low_stock_threshold?: number | null;
  image_url?: string | null;
};

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export function isLowStock(product: Pick<Product, "stock_quantity" | "low_stock_threshold">) {
  return product.stock_quantity <= (product.low_stock_threshold ?? DEFAULT_LOW_STOCK_THRESHOLD);
}

export const cedis = (n: number) => "GH₵" + Number(n).toLocaleString();
