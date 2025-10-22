"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { components as allComponents } from '@/lib/data';
import type { Component, PriceEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogClose } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ComponentPickerProps {
  category: Component['category'];
  onSelectComponent: (component: Component) => void;
}

export default function ComponentPicker({ category, onSelectComponent }: ComponentPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = useMemo(() => {
    return allComponents.filter((component) => {
      const matchesCategory = component.category === category;
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, category]);
  
  const getBestPrice = (prices: PriceEntry[]) => {
    if (!prices || prices.length === 0) return 0;
    return Math.min(...prices.map(p => p.price));
  };

  return (
    <div className="flex flex-col h-full">
      <DialogHeader>
        <DialogTitle>Selecciona un {category}</DialogTitle>
        <DialogDescription>
            Busca y elige un componente para agregarlo a tu configuración.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-grow pr-4 -mr-4">
        <div className="space-y-2">
          {filteredComponents.length > 0 ? (
            filteredComponents.map((component) => (
              <DialogClose asChild key={component.id}>
                <button
                  className="flex items-center w-full p-3 rounded-lg text-left transition-colors hover:bg-muted"
                  onClick={() => onSelectComponent(component)}
                >
                  <Image
                    src={component.imageUrl}
                    alt={component.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <p className="font-semibold">{component.name}</p>
                    <p className="text-sm text-muted-foreground">{component.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${getBestPrice(component.prices).toLocaleString('es-CL')}</p>
                  </div>
                </button>
              </DialogClose>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No se encontraron componentes para esta categoría.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
