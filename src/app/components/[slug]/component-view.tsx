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
import { Bell, CalendarIcon, ExternalLink, RefreshCw, Bot } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Component } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { findPrices } from '@/ai/flows/find-prices-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ComponentView({ initialComponent }: { initialComponent: Component & { id: string } }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isScraping, setIsScraping] = useState(false);
  const { toast } = useToast();
  
  // The initial component is passed as a prop, but we can still listen to firestore for real-time updates
  const componentDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'products', initialComponent.id);
  }, [firestore, initialComponent.id]);

  // The useDoc hook will fetch real-time data, but we start with `initialComponent`
  const { data: componentFromFirestore, isLoading: isComponentLoading } = useDoc<Component>(componentDocRef);

  // Use the firestore data if available, otherwise fall back to the initial prop
  const component = componentFromFirestore || initialComponent;

  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: oneYearAgo,
    to: new Date()
  });

  const handleFindPrices = async () => {
    if (!component || !component.id || !firestore) return;

    setIsScraping(true);
    try {
      const result = await findPrices({ productName: component.name });
      if (result.prices.length > 0) {
        const productRef = doc(firestore, 'products', component.id);
        
        const existingPrices = component.prices || [];
        const newPrices = result.prices.filter(newPrice => 
            !existingPrices.some((existing: { url: string; }) => existing.url === newPrice.url)
        );

        if (newPrices.length > 0) {
            await updateDoc(productRef, { prices: arrayUnion(...newPrices) });
            
             toast({
              title: 'Precios actualizados',
              description: `La IA encontró ${newPrices.length} nuevos precios para ${component.name}.`,
            });
        } else {
             toast({
                variant: 'default',
                title: 'No se encontraron nuevos precios',
                description: `La IA no pudo encontrar precios adicionales en este momento.`,
            });
        }
      } else {
         toast({
            variant: 'default',
            title: 'No se encontraron nuevos precios',
            description: `La IA no pudo encontrar precios adicionales en este momento.`,
        });
      }
    } catch (error) {
      console.error("Error finding prices:", error);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudo completar la búsqueda de precios.',
      });
    } finally {
      setIsScraping(false);
    }
  };

  const filteredPriceHistory = useMemo(() => {
    const history = component?.priceHistory || initialComponent.priceHistory;
    if (!history) return [];
    return history.filter(point => {
        const pointDate = new Date(point.date);
        const fromDate = dateRange.from ? new Date(dateRange.from.setHours(0,0,0,0)) : null;
        const toDate = dateRange.to ? new Date(dateRange.to.setHours(23,59,59,999)): null;

        if (fromDate && pointDate < fromDate) return false;
        if (toDate && pointDate > toDate) return false;
        
        return true;
    });
  }, [dateRange, component, initialComponent]);

  const storeMap = new Map(stores.map(s => [s.id, s.name]));
  
  const displayComponent = component || initialComponent;

  if (isComponentLoading && !component) {
    return <ComponentViewSkeleton />;
  }

  if (!displayComponent) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden sticky top-24 shadow-lg">
            <div className="relative aspect-square w-full bg-muted/30">
              <Image
                src={displayComponent.imageUrl}
                alt={displayComponent.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                data-ai-hint={displayComponent.imageHint}
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div>
            <Badge variant="outline" className="mb-2">{displayComponent.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{displayComponent.name}</h1>
            <p className="text-lg text-muted-foreground">{displayComponent.brand} - {displayComponent.sku}</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <div>
                  <CardTitle>Comparación de Precios</CardTitle>
                  <CardDescription>Precios de los principales minoristas en línea.</CardDescription>
                </div>
                { user && (
                    <Button onClick={handleFindPrices} disabled={isScraping}>
                        {isScraping ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Bot className="mr-2 h-4 w-4" />
                        )}
                        {isScraping ? 'Buscando...' : 'Buscar Precios con IA'}
                    </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {displayComponent.prices && displayComponent.prices.length > 0 ? (
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tienda</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayComponent.prices.sort((a, b) => a.price - b.price).map((price, index) => (
                        <TableRow key={`${price.storeId}-${index}`}>
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
              ) : (
                <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle>Sin precios definidos</AlertTitle>
                    <AlertDescription>
                        Aún no hay precios para este producto. Intenta una búsqueda con IA para encontrarlos.
                    </AlertDescription>
                </Alert>
              )}
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
               {displayComponent.specs && Object.keys(displayComponent.specs).length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(displayComponent.specs).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <p className="font-semibold">{key}</p>
                        <p className="text-muted-foreground">{value as string}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay especificaciones disponibles para este producto.</p>
                )}
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


function ComponentViewSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden sticky top-24 shadow-lg">
            <Skeleton className="aspect-square w-full" />
          </Card>
        </div>
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
               <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
               <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
