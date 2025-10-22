import { components, stores } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PriceHistoryChart from '@/components/price-history-chart';
import { Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return components.map((component) => ({
    slug: component.slug,
  }));
}

export default function ComponentPage({ params }: { params: { slug: string } }) {
  const component = components.find((c) => c.slug === params.slug);

  if (!component) {
    notFound();
  }

  const storeMap = new Map(stores.map(s => [s.id, s.name]));

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden sticky top-24 shadow-lg">
            <div className="relative aspect-square w-full">
              <Image
                src={component.imageUrl}
                alt={component.name}
                fill
                className="object-cover"
                data-ai-hint={component.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  {component.prices.map((price) => (
                    <TableRow key={price.storeId}>
                      <TableCell className="font-medium">{storeMap.get(price.storeId) || 'Tienda Desconocida'}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">${price.price.toFixed(2)}</TableCell>
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
              <CardTitle>Historial de Precios</CardTitle>
              <CardDescription>Tendencia de precios de 30 días para este componente.</CardDescription>
            </CardHeader>
            <CardContent>
                <PriceHistoryChart data={component.priceHistory} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(component.specs).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <p className="font-semibold">{key}</p>
                    <p className="text-muted-foreground">{value}</p>
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
