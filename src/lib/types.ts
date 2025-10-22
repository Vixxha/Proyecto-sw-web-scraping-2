export interface Store {
  id: string;
  name: string;
  logoUrl: string;
}

export interface PriceEntry {
  storeId: string;
  price: number;
  url: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export type Category = 'CPU' | 'GPU' | 'Motherboard' | 'RAM' | 'Storage' | 'Power Supply' | 'Case';

export interface Component {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: Category;
  imageUrl: string;
  imageHint?: string;
  prices?: PriceEntry[];
  priceHistory?: PriceHistoryPoint[];
  specs?: { [key: string]: string };
  slug?: string;
}
