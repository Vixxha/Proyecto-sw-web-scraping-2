

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComponentCard from '@/components/component-card';
import type { Component } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/spinner';
import { components as allComponents } from '@/lib/data'; // Import local data
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';


const categories = ['All', 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case'];
const brands = ['All', 'Intel', 'AMD', 'NVIDIA', 'ASUS', 'Corsair', 'Samsung', 'Gigabyte', 'MSI', 'Crucial', 'SeaSonic', 'NZXT', 'Lian Li', 'Kingston'];
const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'name-asc', label: 'Nombre: A-Z' },
    { value: 'name-desc', label: 'Nombre: Z-A' },
];

const categoryNavLinks = [
    {
      name: 'Gaming y Streaming',
      href: '/gaming-y-streaming'
    },
    {
      name: 'Computación',
      href: '/computacion'
    },
    {
      name: 'Componentes',
      sub: [
        { name: 'Procesadores (CPU)', href: '/components?category=CPU' },
        { name: 'Tarjetas de Video (GPU)', href: '/components?category=GPU' },
        { name: 'Placas Madre', href: '/components?category=Motherboard' },
        { name: 'Memoria RAM', href: '/components?category=RAM' },
        { name: 'Almacenamiento', href: '/components?category=Storage' }
      ]
    },
    {
      name: 'Conectividad y Redes',
      href: '/conectividad-y-redes'
    },
];

const initialPlaceholder = "Ej: 'GeForce RTX 4090'...";

// Helper to get the best price for filtering and sorting
const getBestPrice = (component: Component): number => {
    if (!component.prices || component.prices.length === 0) return component.price || 0;
    return Math.min(...component.prices.map(p => p.price));
};

function ComponentsView({ components }: { components: Component[] }) {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [placeholder, setPlaceholder] = useState('');
  
  const productsLoading = false;

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < initialPlaceholder.length) {
        setPlaceholder(prev => prev + initialPlaceholder[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Speed up animation slightly
    return () => clearInterval(interval);
  }, []);

  // Determine min and max prices for the slider
  const [minPrice, maxPrice] = useMemo(() => {
    if (!components || components.length === 0) {
      return [0, 100000];
    }
    const prices = components.map(getBestPrice);
    return [Math.min(...prices), Math.max(...prices)];
  }, [components]);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    const categoryFromUrl = searchParams.get('category');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const filteredAndSortedComponents = useMemo(() => {
    if (!components) return [];
    
    let filtered = components.filter((component) => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) || component.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All' || component.category === category;
      const matchesBrand = brand === 'All' || component.brand === brand;
      const bestPrice = getBestPrice(component);
      const matchesPrice = bestPrice >= priceRange[0] && bestPrice <= priceRange[1];
      const matchesStock = !inStockOnly || component.stock > 0;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    switch (sortBy) {
        case 'price-asc':
            filtered.sort((a, b) => getBestPrice(a) - getBestPrice(b));
            break;
        case 'price-desc':
            filtered.sort((a, b) => getBestPrice(b) - getBestPrice(a));
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'relevance':
        default:
            // Basic relevance: stock and then price
            filtered.sort((a, b) => b.stock - a.stock || getBestPrice(a) - getBestPrice(b));
            break;
    }

    return filtered;

  }, [searchQuery, category, brand, priceRange, inStockOnly, sortBy, components]);

  const filterControlsContent = (
    <div className="space-y-6">
       <div>
         <Label htmlFor="search-input">Buscar Componente</Label>
         <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-input"
              type="text"
              placeholder={placeholder}
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
      </div>
      <div>
        <Label htmlFor="sort-by-select">Ordenar por</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger id="sort-by-select" className="w-full mt-2">
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category-select">Categoría</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category-select" className="w-full mt-2">
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="brand-select">Marca</Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger id="brand-select" className="w-full mt-2">
            <SelectValue placeholder="Seleccionar marca" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Rango de Precios</Label>
        <div className="mt-4">
          <Slider
            min={minPrice}
            max={maxPrice}
            step={1000}
            value={priceRange}
            onValueChange={(value: [number, number]) => setPriceRange(value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>${priceRange[0].toLocaleString('es-CL')}</span>
          <span>${priceRange[1].toLocaleString('es-CL')}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
          <Label htmlFor="stock-switch" className="flex flex-col space-y-1">
              <span>Solo en Stock</span>
              <span className="font-normal leading-snug text-muted-foreground">
                  Mostrar solo productos disponibles.
              </span>
          </Label>
          <Switch
              id="stock-switch"
              checked={inStockOnly}
              onCheckedChange={setInStockOnly}
          />
      </div>
    </div>
  );

  return (
    <>
      <section className="text-center py-12 container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Explorar Componentes
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Encuentra el componente perfecto para tu PC. Filtra por categoría, marca y más.
        </p>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <Card>
              <CardHeader>
                  <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                {filterControlsContent}
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <p className="text-sm text-muted-foreground">{filteredAndSortedComponents.length} resultados</p>
               <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filtros</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="py-8">
                      {filterControlsContent}
                    </div>
                  </SheetContent>
                </Sheet>
            </div>
            {productsLoading ? (
              <div className="flex justify-center items-center h-64"><Spinner className="h-12 w-12" /></div>
            ) : filteredAndSortedComponents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedComponents.map((component) => (
                  <ComponentCard key={component.id} component={component} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 col-span-full">
                <p className="text-xl font-medium text-muted-foreground">No se encontraron componentes.</p>
                <p className="text-muted-foreground mt-2">Intenta ajustar tu búsqueda o filtros.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default function ComponentsPage() {
  // Pass the components data as a prop to the client component.
  // This avoids bundling the data file with the client-side JavaScript.
  return <ComponentsView components={allComponents} />;
}
