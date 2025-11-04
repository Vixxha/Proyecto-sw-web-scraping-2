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
  normalPrice: number;
  offerPrice: number;
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
  description?: string;
  price: number;
  stock: number;
  prices: PriceEntry[];
  priceHistory: PriceHistoryPoint[];
  slug: string;
  specs: { [key: string]: string | number };
}

export interface PCBuild {
  id: string;
  userId: string;
  name: string;
  components: Record<Category, string[]>; // Changed from Component[] to string[]
  totalPrice: number;
  createdAt: any; // Firestore Timestamp
}
