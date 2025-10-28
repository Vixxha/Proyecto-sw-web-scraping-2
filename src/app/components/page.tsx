

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComponentCard from '@/components/component-card';
import { components as allComponents } from '@/lib/data';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const categories = ['All', 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case'];
const brands = ['All', 'Intel', 'AMD', 'NVIDIA', 'ASUS', 'Corsair', 'Samsung', 'Gigabyte', 'MSI', 'Crucial', 'SeaSonic', 'NZXT'];

export default function ComponentsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  
  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  const filteredComponents = useMemo(() => {
    return allComponents.filter((component) => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) || component.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All' || component.category === category;
      const matchesBrand = brand === 'All' || component.brand === brand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchQuery, category, brand]);

  const filterControlsContent = (
    <div className="space-y-6">
       <div>
         <Label htmlFor="search-input">Buscar Componente</Label>
         <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-input"
              type="text"
              placeholder="Buscar por nombre o SKU..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Explorar Componentes
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Encuentra el componente perfecto para tu PC. Filtra por categoría, marca y más.
        </p>
      </section>

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
            <p className="text-sm text-muted-foreground">{filteredComponents.length} resultados</p>
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
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredComponents.map((component) => (
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
  );
}
