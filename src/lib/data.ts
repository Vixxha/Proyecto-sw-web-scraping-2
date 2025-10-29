import type { Component, Store, PriceHistoryPoint } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const stores: Store[] = [
  { id: 'store-1', name: 'PC Factory', logoUrl: '/logos/pc-parts-plus.png' },
  { id: 'store-2', name: 'SP Digital', logoUrl: '/logos/tech-giga.png' },
  { id: 'store-3', name: 'Infor-Ingen', logoUrl: '/logos/circuit-city.png' },
];

export const components: Component[] = [
  {
    "id": "1",
    "name": "Intel Core i9-13900K",
    "slug": "intel-core-i9-13900k",
    "sku": "BX8071513900K",
    "brand": "Intel",
    "category": "CPU",
    "price": 589000,
    "stock": 50,
    "imageUrl": "https://media.solotodo.com/media/products/1648670_picture_1664519640.jpg",
    "imageHint": "Intel processor",
    "specs": {
      "Socket": "LGA1700",
      "Cores": "24 (8P + 16E)",
      "Threads": "32",
      "Base Clock": "3.0 GHz",
      "Boost Clock": "5.8 GHz"
    },
    "prices": [
      {"storeId": "store-1", "price": 589000, "url": "#"},
      {"storeId": "store-2", "price": 599000, "url": "#"}
    ],
    "priceHistory": [
        { "date": "2024-05-01", "normalPrice": 599000, "offerPrice": 589000 },
        { "date": "2024-06-01", "normalPrice": 595000, "offerPrice": 585000 },
        { "date": "2024-07-01", "normalPrice": 610000, "offerPrice": 600000 }
    ]
  },
  {
    "id": "2",
    "name": "AMD Ryzen 9 7950X",
    "slug": "amd-ryzen-9-7950x",
    "sku": "100-100000514WOF",
    "brand": "AMD",
    "category": "CPU",
    "price": 540000,
    "stock": 45,
    "imageUrl": "https://media.solotodo.com/media/products/1647413_picture_1662489812.jpg",
    "imageHint": "AMD processor",
    "specs": {
      "Socket": "AM5",
      "Cores": "16",
      "Threads": "32",
      "Base Clock": "4.5 GHz",
      "Boost Clock": "5.7 GHz"
    },
    "prices": [
        {"storeId": "store-1", "price": 540000, "url": "#"},
        {"storeId": "store-2", "price": 550000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "3",
    "name": "NVIDIA GeForce RTX 4090 Founders Edition",
    "slug": "nvidia-geforce-rtx-4090",
    "sku": "900-1G136-2530-000",
    "brand": "NVIDIA",
    "category": "GPU",
    "price": 1850000,
    "stock": 15,
    "imageUrl": "https://media.solotodo.com/media/products/1651817_picture_1664390072.jpg",
    "imageHint": "NVIDIA graphics card",
    "specs": {
      "Memory": "24GB GDDR6X",
      "Boost Clock": "2.52 GHz",
      "CUDA Cores": "16384"
    },
    "prices": [
        {"storeId": "store-1", "price": 1850000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "4",
    "name": "ASUS ROG MAXIMUS Z790 HERO",
    "slug": "asus-rog-maximus-z790-hero",
    "sku": "ROG MAXIMUS Z790 HERO",
    "brand": "ASUS",
    "category": "Motherboard",
    "price": 680000,
    "stock": 25,
    "imageUrl": "https://media.solotodo.com/media/products/1651910_picture_1665082143.jpg",
    "imageHint": "ASUS motherboard",
    "specs": {
      "Socket": "LGA1700",
      "Chipset": "Intel Z790",
      "Form Factor": "ATX",
      "Memory Type": "DDR5"
    },
    "prices": [
        {"storeId": "store-2", "price": 680000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "5",
    "name": "Gigabyte Z790 AORUS ELITE AX",
    "slug": "gigabyte-z790-aorus-elite-ax",
    "sku": "Z790 AORUS ELITE AX",
    "brand": "Gigabyte",
    "category": "Motherboard",
    "price": 280000,
    "stock": 35,
    "imageUrl": "https://media.solotodo.com/media/products/1652033_picture_1665082390.jpg",
    "imageHint": "Gigabyte motherboard",
    "specs": {
        "Socket": "LGA1700",
        "Chipset": "Intel Z790",
        "Form Factor": "ATX",
        "Memory Type": "DDR5"
    },
    "prices": [
        {"storeId": "store-1", "price": 280000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "6",
    "name": "Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz",
    "slug": "corsair-vengeance-32gb-ddr5",
    "sku": "CMK32GX5M2B6000C36",
    "brand": "Corsair",
    "category": "RAM",
    "price": 135000,
    "stock": 100,
    "imageUrl": "https://media.solotodo.com/media/products/1638421_picture_1660144983.jpg",
    "imageHint": "Corsair RAM",
    "specs": {
        "Type": "DDR5",
        "Capacity": "32GB",
        "Speed": "6000MHz",
        "Latency": "CL36"
    },
    "prices": [
        {"storeId": "store-1", "price": 135000, "url": "#"},
        {"storeId": "store-3", "price": 140000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "7",
    "name": "Kingston Fury Beast 16GB DDR4 3200MHz",
    "slug": "kingston-fury-beast-16gb-ddr4",
    "sku": "KF432C16BB/16",
    "brand": "Kingston",
    "category": "RAM",
    "price": 45000,
    "stock": 150,
    "imageUrl": "https://media.solotodo.com/media/products/1612711_picture_1636959556.jpg",
    "imageHint": "Kingston RAM",
    "specs": {
        "Type": "DDR4",
        "Capacity": "16GB",
        "Speed": "3200MHz",
        "Latency": "CL16"
    },
    "prices": [
        {"storeId": "store-1", "price": 45000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "8",
    "name": "Samsung 980 Pro 1TB NVMe SSD",
    "slug": "samsung-980-pro-1tb",
    "sku": "MZ-V8P1T0BW",
    "brand": "Samsung",
    "category": "Storage",
    "price": 110000,
    "stock": 80,
    "imageUrl": "https://media.solotodo.com/media/products/1593361_picture_1631557008.jpg",
    "imageHint": "Samsung SSD",
    "specs": {
        "Interface": "PCIe 4.0 x4, NVMe",
        "Capacity": "1TB",
        "Read Speed": "7000 MB/s",
        "Write Speed": "5000 MB/s"
    },
    "prices": [
        {"storeId": "store-2", "price": 110000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "9",
    "name": "Crucial P3 Plus 2TB NVMe SSD",
    "slug": "crucial-p3-plus-2tb",
    "sku": "CT2000P3PSSD8",
    "brand": "Crucial",
    "category": "Storage",
    "price": 130000,
    "stock": 70,
    "imageUrl": "https://media.solotodo.com/media/products/1647209_picture_1662489679.jpg",
    "imageHint": "Crucial SSD",
    "specs": {
        "Interface": "PCIe 4.0 x4, NVMe",
        "Capacity": "2TB",
        "Read Speed": "5000 MB/s",
        "Write Speed": "4200 MB/s"
    },
    "prices": [
        {"storeId": "store-3", "price": 130000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "10",
    "name": "SeaSonic FOCUS Plus Gold 850W",
    "slug": "seasonic-focus-plus-gold-850w",
    "sku": "SSR-850FX",
    "brand": "SeaSonic",
    "category": "Power Supply",
    "price": 125000,
    "stock": 60,
    "imageUrl": "https://media.solotodo.com/media/products/1545642_picture_1603728637.jpg",
    "imageHint": "SeaSonic power supply",
    "specs": {
        "Wattage": "850W",
        "Rating": "80 PLUS Gold",
        "Modularity": "Fully Modular"
    },
    "prices": [
        {"storeId": "store-1", "price": 125000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "11",
    "name": "Corsair RM750e 750W",
    "slug": "corsair-rm750e-750w",
    "sku": "CP-9020248-NA",
    "brand": "Corsair",
    "category": "Power Supply",
    "price": 105000,
    "stock": 75,
    "imageUrl": "https://media.solotodo.com/media/products/1664115_picture_1670868285.jpg",
    "imageHint": "Corsair power supply",
    "specs": {
        "Wattage": "750W",
        "Rating": "80 PLUS Gold",
        "Modularity": "Fully Modular"
    },
    "prices": [
        {"storeId": "store-2", "price": 105000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "12",
    "name": "NZXT H5 Flow",
    "slug": "nzxt-h5-flow",
    "sku": "CC-H51FW-01",
    "brand": "NZXT",
    "category": "Case",
    "price": 85000,
    "stock": 40,
    "imageUrl": "https://media.solotodo.com/media/products/1646200_picture_1661841380.jpg",
    "imageHint": "NZXT computer case",
    "specs": {
        "Type": "Mid Tower",
        "Motherboard Support": "ATX, Micro-ATX, Mini-ITX",
        "Color": "White"
    },
    "prices": [
        {"storeId": "store-3", "price": 85000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "13",
    "name": "Lian Li Lancool 216",
    "slug": "lian-li-lancool-216",
    "sku": "LANCOOL 216",
    "brand": "Lian Li",
    "category": "Case",
    "price": 95000,
    "stock": 30,
    "imageUrl": "https://media.solotodo.com/media/products/1655075_picture_1666803714.jpg",
    "imageHint": "Lian Li computer case",
    "specs": {
        "Type": "Mid Tower",
        "Motherboard Support": "E-ATX, ATX, Micro-ATX, Mini-ITX",
        "Color": "Black"
    },
    "prices": [
        {"storeId": "store-1", "price": 95000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "14",
    "name": "AMD Radeon RX 7900 XTX",
    "slug": "amd-radeon-rx-7900-xtx",
    "sku": "100-300000001",
    "brand": "AMD",
    "category": "GPU",
    "price": 1100000,
    "stock": 20,
    "imageUrl": "https://media.solotodo.com/media/products/1657065_picture_1667498759.jpg",
    "imageHint": "AMD GPU",
    "specs": {
        "Memory": "24GB GDDR6",
        "Boost Clock": "2.5 GHz",
        "Stream Processors": "6144"
    },
    "prices": [
        {"storeId": "store-1", "price": 1100000, "url": "#"}
    ],
    "priceHistory": []
  },
  {
    "id": "15",
    "name": "Intel Core i5-13600K",
    "slug": "intel-core-i5-13600k",
    "sku": "BX8071513600K",
    "brand": "Intel",
    "category": "CPU",
    "price": 310000,
    "stock": 65,
    "imageUrl": "https://media.solotodo.com/media/products/1648672_picture_1664519642.jpg",
    "imageHint": "Intel processor",
    "specs": {
        "Socket": "LGA1700",
        "Cores": "14 (6P + 8E)",
        "Threads": "20",
        "Base Clock": "3.5 GHz",
        "Boost Clock": "5.1 GHz"
    },
    "prices": [
        {"storeId": "store-2", "price": 310000, "url": "#"}
    ],
    "priceHistory": []
  }
];
    