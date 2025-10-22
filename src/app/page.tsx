"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComponentCard from '@/components/component-card';
import { components as allComponents } from '@/lib/data';
import type { Component } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const categories = ['All', 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case'];
const brands = ['All', 'Intel', 'AMD', 'NVIDIA', 'ASUS', 'Corsair', 'Samsung', 'Gigabyte', 'MSI', 'Crucial', 'SeaSonic', 'NZXT'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredComponents = useMemo(() => {
    return allComponents.filter((component) => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) || component.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All' || component.category === category;
      const matchesBrand = brand === 'All' || component.brand === brand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchQuery, category, brand]);

  const FilterControls = () => (
    <div className="space-y-6">
       <div>
        <Label htmlFor="search-input-mobile" className="mb-2 block text-sm font-medium">Search</Label>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-input-mobile"
              type="text"
              placeholder="Search by name or SKU..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
      </div>
      <div>
        <Label htmlFor="category-select" className="mb-2 block text-sm font-medium">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category-select" className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="brand-select" className="mb-2 block text-sm font-medium">Brand</Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger id="brand-select" className="w-full">
            <SelectValue placeholder="Select brand" />
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
       <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Find Your Perfect PC Part
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Compare prices from top retailers and build your dream PC for less.
        </p>
      </section>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filters */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <Card>
                <CardContent className="pt-6">
                    <FilterControls />
                </CardContent>
            </Card>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {/* Mobile Filters Trigger */}
           <div className="lg:hidden mb-6 flex items-center gap-4">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Search components..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                   <span className="sr-only">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <div className="space-y-6">
                      <div>
                        <Label htmlFor="category-select-mobile" className="mb-2 block text-sm font-medium">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger id="category-select-mobile" className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="brand-select-mobile" className="mb-2 block text-sm font-medium">Brand</Label>
                        <Select value={brand} onValueChange={setBrand}>
                          <SelectTrigger id="brand-select-mobile" className="w-full">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
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
              <p className="text-xl font-medium text-muted-foreground">No components found.</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
