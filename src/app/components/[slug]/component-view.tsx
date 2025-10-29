
'use client';

import { useState, useMemo, useEffect } from 'react';
import { stores } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PriceHistoryChart from '@/components/price-history-chart';
import { Bell, CalendarIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Component } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Spinner from '@/components/spinner';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

type ComponentWithId = Component & { id: string };

export default function ComponentView({ slug }: { slug: string }) {
  const firestore = useFirestore();
  const [component, setComponent] = useState<ComponentWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const componentQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: componentData, isLoading: componentLoading } = useCollection<ComponentWithId>(componentQuery);

  useEffect(() => {
    // We only set loading to false once the initial fetch is done.
    if (!componentLoading) {
      setIsLoading(false);
      if (componentData && componentData.length > 0) {
        setComponent(componentData[0]);
      } else {
        setComponent(null); // Explicitly set to null if not found
      }
    }
  }, [componentData, componentLoading]);
  
  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: oneYearAgo,
    to: new Date()
  });

  const filteredPriceHistory = useMemo(() => {
    if (!component || !component.priceHistory) return [];
    return component.priceHistory.filter(point => {
        const pointDate = new Date(point.date);
        const fromDate = dateRange.from ? new Date(dateRange.from.setHours(0,0,0,0)) : null;
        const toDate = dateRange.to ? new Date(dateRange.to.setHours(23,59,59,999)): null;

        if (fromDate && pointDate < fromDate) return false;
        if (toDate && pointDate > toDate) return false;
        
        return true;
    });
  }, [dateRange, component]);

  const storeMap = new Map(stores.map(s => [s.id, s.name]));

  // Show skeleton loader while fetching
  if (isLoading) {
    return (
       <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-6 w-1/4 rounded-md" />
            </div>
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // If loading is finished and no component was found, show 404 page
  if (!component) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden sticky top-24 shadow-lg">
            <div className="relative aspect-square w-full bg-muted/30">
              <Image
                src={component.imageUrl}
                alt={component.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                data-ai-hint={component.imageHint}
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div>
            <Badge variant="outline" className="mb-2">{component.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{component.name}</h1>
            <p className="text-lg text-muted-foreground">{component.brand} - {component.sku}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comparación de Precios</CardTitle>
              <CardDescription>Precios de los principales minoristas en línea.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tienda</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {component.prices && component.prices.map((price) => (
                    <TableRow key={price.storeId}>
                      <TableCell className="font-medium">{storeMap.get(price.storeId) || 'Tienda Desconocida'}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">${price.price.toLocaleString('es-CL')}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={price.url} target="_blank" rel="noopener noreferrer">
                            Ir a la tienda <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Historial de Precios</CardTitle>
                    <CardDescription>Tendencia de precios para este componente.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[150px] justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "LLL dd, y", { locale: es }) : <span>Desde</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange(prev => ({...prev, from: date}))}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[150px] justify-start text-left font-normal",
                            !dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "LLL dd, y", { locale: es }) : <span>Hasta</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange(prev => ({...prev, to: date}))}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
                <PriceHistoryChart data={filteredPriceHistory} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {component.specs && Object.entries(component.specs).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <p className="font-semibold">{key}</p>
                    <p className="text-muted-foreground">{value as string}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crear Alerta de Precio</CardTitle>
              <CardDescription>Recibe una notificación cuando el precio baje de tu objetivo.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                   <Input type="number" placeholder="Tu precio objetivo" className="pl-6" />
                </div>
                <Button>
                  <Bell className="mr-2 h-4 w-4" /> Crear Alerta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
