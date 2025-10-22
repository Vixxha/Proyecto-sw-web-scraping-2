import type { Component, Store, PriceHistoryPoint } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const stores: Store[] = [
  { id: 'store-1', name: 'PC Parts Plus', logoUrl: '/logos/pc-parts-plus.png' },
  { id: 'store-2', name: 'Tech Giga', logoUrl: '/logos/tech-giga.png' },
  { id: 'store-3', name: 'Circuit City', logoUrl: '/logos/circuit-city.png' },
];

const generatePriceHistory = (basePrice: number): PriceHistoryPoint[] => {
  const history: PriceHistoryPoint[] = [];
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30);
  for (let i = 0; i < 30; i++) {
    const fluctuation = (Math.random() - 0.5) * (basePrice * 0.1);
    history.push({
      date: currentDate.toISOString().split('T')[0],
      price: Math.round((basePrice + fluctuation) * 100) / 100,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return history;
};

const placeholderImageMap = new Map(PlaceHolderImages.map(p => [p.id, p]));

export const components: Component[] = [
  {
    id: '1',
    slug: 'intel-core-i9-13900k',
    name: 'Intel Core i9-13900K',
    sku: 'BX8071513900K',
    brand: 'Intel',
    category: 'CPU',
    imageUrl: placeholderImageMap.get('cpu-1')?.imageUrl || 'https://picsum.photos/seed/101/600/600',
    imageHint: 'processor chip',
    prices: [
      { storeId: 'store-1', price: 589.99, url: '#' },
      { storeId: 'store-2', price: 599.99, url: '#' },
      { storeId: 'store-3', price: 585.0, url: '#' },
    ],
    priceHistory: generatePriceHistory(590),
    specs: {
      Cores: '24 (8P + 16E)',
      Threads: '32',
      'Max Turbo Frequency': '5.8 GHz',
      Socket: 'LGA1700',
    },
  },
  {
    id: '2',
    slug: 'nvidia-geforce-rtx-4090',
    name: 'NVIDIA GeForce RTX 4090',
    sku: 'RTX4090-FOUNDERS',
    brand: 'NVIDIA',
    category: 'GPU',
    imageUrl: placeholderImageMap.get('gpu-1')?.imageUrl || 'https://picsum.photos/seed/102/600/400',
    imageHint: 'graphics card',
    prices: [
      { storeId: 'store-1', price: 1599.99, url: '#' },
      { storeId: 'store-2', price: 1649.99, url: '#' },
    ],
    priceHistory: generatePriceHistory(1620),
    specs: {
      'CUDA Cores': '16384',
      'Boost Clock': '2.52 GHz',
      'Memory Size': '24 GB GDDR6X',
      'Power Connectors': '1x 16-pin',
    },
  },
  {
    id: '3',
    slug: 'asus-rog-maximus-z790-hero',
    name: 'ASUS ROG Maximus Z790 Hero',
    sku: 'ROG-MAX-Z790-HERO',
    brand: 'ASUS',
    category: 'Motherboard',
    imageUrl: placeholderImageMap.get('motherboard-1')?.imageUrl || 'https://picsum.photos/seed/103/600/600',
    imageHint: 'motherboard circuit',
    prices: [
      { storeId: 'store-1', price: 629.99, url: '#' },
      { storeId: 'store-3', price: 619.99, url: '#' },
    ],
    priceHistory: generatePriceHistory(625),
    specs: {
      Chipset: 'Intel Z790',
      'Memory Support': 'DDR5',
      'Form Factor': 'ATX',
      'PCIe Slots': '2 x PCIe 5.0 x16',
    },
  },
  {
    id: '4',
    slug: 'corsair-vengeance-32gb-ddr5',
    name: 'Corsair Vengeance 32GB DDR5',
    sku: 'CMK32GX5M2B5200C40',
    brand: 'Corsair',
    category: 'RAM',
    imageUrl: placeholderImageMap.get('ram-1')?.imageUrl || 'https://picsum.photos/seed/104/600/400',
    imageHint: 'ram stick',
    prices: [
      { storeId: 'store-1', price: 99.99, url: '#' },
      { storeId: 'store-2', price: 104.99, url: '#' },
      { storeId: 'store-3', price: 97.99, url: '#' },
    ],
    priceHistory: generatePriceHistory(100),
    specs: {
      Capacity: '32GB (2 x 16GB)',
      Speed: 'DDR5 5200MHz',
      'CAS Latency': '40',
      'Voltage': '1.25V',
    },
  },
  {
    id: '5',
    slug: 'samsung-980-pro-2tb',
    name: 'Samsung 980 Pro 2TB',
    sku: 'MZ-V8P2T0BW',
    brand: 'Samsung',
    category: 'Storage',
    imageUrl: placeholderImageMap.get('ssd-1')?.imageUrl || 'https://picsum.photos/seed/105/600/400',
    imageHint: 'ssd drive',
    prices: [
      { storeId: 'store-1', price: 169.99, url: '#' },
      { storeId: 'store-2', price: 175.99, url: '#' },
      { storeId: 'store-3', price: 169.99, url: '#' },
    ],
    priceHistory: generatePriceHistory(172),
    specs: {
      Capacity: '2TB',
      Interface: 'PCIe 4.0 NVMe',
      'Read Speed': 'Up to 7,000 MB/s',
      'Write Speed': 'Up to 5,100 MB/s',
    },
  },
  {
    id: '6',
    slug: 'amd-ryzen-9-7950x',
    name: 'AMD Ryzen 9 7950X',
    sku: '100-100000514WOF',
    brand: 'AMD',
    category: 'CPU',
    imageUrl: placeholderImageMap.get('cpu-2')?.imageUrl || 'https://picsum.photos/seed/106/600/600',
    imageHint: 'processor chip',
    prices: [
      { storeId: 'store-1', price: 549.0, url: '#' },
      { storeId: 'store-2', price: 559.99, url: '#' },
      { storeId: 'store-3', price: 545.5, url: '#' },
    ],
    priceHistory: generatePriceHistory(550),
    specs: {
      Cores: '16',
      Threads: '32',
      'Max Boost Clock': 'Up to 5.7 GHz',
      Socket: 'AM5',
    },
  },
    {
    id: '7',
    slug: 'amd-radeon-rx-7900-xtx',
    name: 'AMD Radeon RX 7900 XTX',
    sku: 'RX7900XTX-GAMING',
    brand: 'AMD',
    category: 'GPU',
    imageUrl: placeholderImageMap.get('gpu-2')?.imageUrl || 'https://picsum.photos/seed/107/600/400',
    imageHint: 'graphics card',
    prices: [
      { storeId: 'store-1', price: 999.99, url: '#' },
      { storeId: 'store-2', price: 979.99, url: '#' },
    ],
    priceHistory: generatePriceHistory(985),
    specs: {
        'Stream Processors': '6144',
        'Game Clock': '2.3 GHz',
        'Memory Size': '24 GB GDDR6',
        'Power Connectors': '2x 8-pin',
    },
  },
];
