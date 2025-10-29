
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
  currentDate.setDate(currentDate.getDate() - 365); // Generate data for 1 year
  for (let i = 0; i < 365; i++) {
    const fluctuation = (Math.random() - 0.5) * (basePrice * 0.05); // Smaller fluctuation
    const normalPrice = Math.round(basePrice + fluctuation);
    const offerFluctuation = Math.random() * (basePrice * 0.08); // Offer is always lower
    const offerPrice = Math.round(normalPrice - offerFluctuation);
    
    history.push({
      date: currentDate.toISOString().split('T')[0],
      normalPrice: normalPrice,
      offerPrice: offerPrice,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return history;
};

const placeholderImageMap = new Map(PlaceHolderImages.map(p => [p.id, p]));

// This static data is now deprecated and will be removed in favor of Firestore.
// It is kept temporarily to prevent breaking other components that might still reference it.
const rawComponents: Omit<Component, 'priceHistory' | 'imageUrl' | 'imageHint' | 'price' | 'stock'>[] = [];

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
        if (categoryImages.length > 0) return categoryImages[Math.floor(Math.random() * categoryImages.length)];
    }

    return placeholderImageMap.get(imageId || '') || PlaceHolderImages[0];
}


export const components: Component[] = rawComponents.map(component => {
    const bestPrice = Math.min(...component.prices.map(p => p.price));
    const imageInfo = getImageForComponent(component.slug, component.category);
    return {
        ...component,
        price: bestPrice,
        stock: Math.floor(Math.random() * 100), // Mock stock
        priceHistory: generatePriceHistory(bestPrice),
        imageUrl: imageInfo.imageUrl,
        imageHint: imageInfo.imageHint,
    };
});

    