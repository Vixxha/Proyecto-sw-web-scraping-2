
import type { Component, Store, PriceHistoryPoint } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const stores: Store[] = [
  { id: 'store-1', name: 'PC Factory', logoUrl: '/logos/pc-parts-plus.png' },
  { id: 'store-2', name: 'SP Digital', logoUrl: '/logos/tech-giga.png' },
  { id: 'store-3', name: 'Infor-Ingen', logoUrl: '/logos/circuit-city.png' },
];

const generatePriceHistory = (basePrice: number): PriceHistoryPoint[] => {
  const history: PriceHistoryPoint[] = [];
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30);
  for (let i = 0; i < 30; i++) {
    const fluctuation = (Math.random() - 0.5) * (basePrice * 0.1);
    history.push({
      date: currentDate.toISOString().split('T')[0],
      price: Math.round(basePrice + fluctuation),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return history;
};

const placeholderImageMap = new Map(PlaceHolderImages.map(p => [p.id, p]));

const rawComponents: Omit<Component, 'priceHistory' | 'imageUrl' | 'imageHint'>[] = [
  {
    id: '1',
    slug: 'intel-core-i9-13900k',
    name: 'Intel Core i9-13900K',
    sku: 'BX8071513900K',
    brand: 'Intel',
    category: 'CPU',
    prices: [
      { storeId: 'store-1', price: 589990, url: '#' },
      { storeId: 'store-2', price: 599990, url: '#' },
      { storeId: 'store-3', price: 585000, url: '#' },
    ],
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
    prices: [
      { storeId: 'store-1', price: 1599990, url: '#' },
      { storeId: 'store-2', price: 1649990, url: '#' },
    ],
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
    prices: [
      { storeId: 'store-1', price: 629990, url: '#' },
      { storeId: 'store-3', price: 619990, url: '#' },
    ],
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
    prices: [
      { storeId: 'store-1', price: 99990, url: '#' },
      { storeId: 'store-2', price: 104990, url: '#' },
      { storeId: 'store-3', price: 97990, url: '#' },
    ],
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
    prices: [
      { storeId: 'store-1', price: 169990, url: '#' },
      { storeId: 'store-2', price: 175990, url: '#' },
      { storeId: 'store-3', price: 169990, url: '#' },
    ],
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
    prices: [
      { storeId: 'store-1', price: 549000, url: '#' },
      { storeId: 'store-2', price: 559990, url: '#' },
      { storeId: 'store-3', price: 545500, url: '#' },
    ],
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
    prices: [
      { storeId: 'store-1', price: 999990, url: '#' },
      { storeId: 'store-2', price: 979990, url: '#' },
    ],
    specs: {
        'Stream Processors': '6144',
        'Game Clock': '2.3 GHz',
        'Memory Size': '24 GB GDDR6',
        'Power Connectors': '2x 8-pin',
    },
  },
  {
    id: '8',
    slug: 'gigabyte-z790-aorus-elite-ax',
    name: 'Gigabyte Z790 AORUS ELITE AX',
    sku: 'Z790-AORUS-ELITE-AX',
    brand: 'Gigabyte',
    category: 'Motherboard',
    prices: [
      { storeId: 'store-1', price: 259990, url: '#' },
      { storeId: 'store-2', price: 249990, url: '#' },
    ],
    specs: {
      Chipset: 'Intel Z790',
      'Memory Support': 'DDR5',
      'Form Factor': 'ATX',
      'PCIe Slots': '1 x PCIe 5.0 x16',
    },
  },
  {
    id: '9',
    slug: 'crucial-ballistix-16gb-ddr4',
    name: 'Crucial Ballistix 16GB DDR4',
    sku: 'BL2K8G32C16U4B',
    brand: 'Crucial',
    category: 'RAM',
    prices: [
      { storeId: 'store-1', price: 74990, url: '#' },
      { storeId: 'store-3', price: 72990, url: '#' },
    ],
    specs: {
      Capacity: '16GB (2 x 8GB)',
      Speed: 'DDR4 3200MHz',
      'CAS Latency': '16',
      'Voltage': '1.35V',
    },
  },
  {
    id: '10',
    slug: 'seasonic-focus-plus-gold-750w',
    name: 'SeaSonic FOCUS Plus Gold 750W',
    sku: 'SSR-750FX',
    brand: 'SeaSonic',
    category: 'Power Supply',
    prices: [
      { storeId: 'store-1', price: 129990, url: '#' },
      { storeId: 'store-2', price: 134990, url: '#' },
    ],
    specs: {
      Wattage: '750W',
      '80+ Rating': 'Gold',
      Modularity: 'Fully Modular',
      'Form Factor': 'ATX',
    },
  },
  {
    id: '11',
    slug: 'intel-core-i5-13600k',
    name: 'Intel Core i5-13600K',
    sku: 'BX8071513600K',
    brand: 'Intel',
    category: 'CPU',
    prices: [
      { storeId: 'store-1', price: 319990, url: '#' },
      { storeId: 'store-2', price: 329990, url: '#' },
      { storeId: 'store-3', price: 315000, url: '#' },
    ],
    specs: {
        Cores: '14 (6P + 8E)',
        Threads: '20',
        'Max Turbo Frequency': '5.1 GHz',
        Socket: 'LGA1700',
    },
  },
  {
    id: '12',
    slug: 'nzxt-h510',
    name: 'NZXT H510',
    sku: 'CA-H510B-W1',
    brand: 'NZXT',
    category: 'Case',
    prices: [
      { storeId: 'store-1', price: 69990, url: '#' },
      { storeId: 'store-3', price: 68990, url: '#' },
    ],
    specs: {
        Type: 'ATX Mid Tower',
        'Side Panel': 'Tempered Glass',
        'Expansion Slots': '7',
        'Color': 'Matte White',
    },
  },
   {
    id: '13',
    slug: 'msi-mag-b660m-mortar-wifi-ddr4',
    name: 'MSI MAG B660M Mortar WIFI DDR4',
    sku: 'MAG-B660M-MORTAR-WIFI-DDR4',
    brand: 'MSI',
    category: 'Motherboard',
    prices: [
      { storeId: 'store-1', price: 159990, url: '#' },
      { storeId: 'store-2', price: 164990, url: '#' },
    ],
    specs: {
      Chipset: 'Intel B660',
      'Memory Support': 'DDR4',
      'Form Factor': 'Micro-ATX',
      'PCIe Slots': '1 x PCIe 4.0 x16',
    },
  },
];

const getImageForComponent = (slug: string, category: string) => {
    let imageId;
    if (slug.includes('i9') || slug.includes('13900')) imageId = 'cpu-1';
    else if (slug.includes('i5') || slug.includes('13600')) imageId = 'cpu-3';
    else if (slug.includes('ryzen-9')) imageId = 'cpu-2';
    else if (slug.includes('4090')) imageId = 'gpu-1';
    else if (slug.includes('7900')) imageId = 'gpu-2';
    else if (slug.includes('maximus')) imageId = 'motherboard-1';
    else if (slug.includes('aorus')) imageId = 'motherboard-2';
    else if (slug.includes('mortar')) imageId = 'motherboard-3';
    else if (slug.includes('vengeance')) imageId = 'ram-1';
    else if (slug.includes('ballistix')) imageId = 'ram-2';
    else if (slug.includes('980-pro')) imageId = 'ssd-1';
    else if (slug.includes('focus-plus')) imageId = 'psu-1';
    else if (slug.includes('h510')) imageId = 'case-1';
    else {
        // Fallback
        const categoryImages = PlaceHolderImages.filter(p => p.imageHint.includes(category.toLowerCase()));
        if (categoryImages.length > 0) return categoryImages[0];
    }

    return placeholderImageMap.get(imageId || '') || PlaceHolderImages[0];
}


export const components: Component[] = rawComponents.map(component => {
    const bestPrice = Math.min(...component.prices.map(p => p.price));
    const imageInfo = getImageForComponent(component.slug, component.category);
    return {
        ...component,
        priceHistory: generatePriceHistory(bestPrice),
        imageUrl: imageInfo.imageUrl,
        imageHint: imageInfo.imageHint,
    };
});

    