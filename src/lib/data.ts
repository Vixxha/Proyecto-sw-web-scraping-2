
import type { Component, Store, PriceHistoryPoint } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const stores: Store[] = [
  { id: 'store-1', name: 'PC Factory', logoUrl: '/logos/pc-parts-plus.png' },
  { id: 'store-2', name: 'SP Digital', logoUrl: '/logos/tech-giga.png' },
  { id: 'store-3', name: 'Infor-Ingen', logoUrl: '/logos/circuit-city.png' },
];

// This static data is now deprecated and will be removed in favor of Firestore.
// It is kept temporarily to prevent breaking other components that might still reference it.
export const components: Component[] = [];
