
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Component } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface ComponentCardProps {
  component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const bestPrice = component.prices && component.prices.length > 0
    ? Math.min(...component.prices.map(p => p.price))
    : null;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-105">
      <Link href={`/components/${component.slug}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full bg-muted/30">
            <Image
              src={component.imageUrl}
              alt={component.name}
              fill
              className="w-full h-full object-cover"
              data-ai-hint={component.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div>
            <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{component.category}</Badge>
                {bestPrice !== null && (
                  <p className="text-xl font-bold text-primary">
                    ${bestPrice.toLocaleString('es-CL')}
                  </p>
                )}
            </div>
            <h3 className="text-base font-semibold leading-tight mt-1 h-12 line-clamp-2">{component.name}</h3>
            <p className="text-sm text-muted-foreground">{component.brand}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
           <Button className="w-full" variant="outline" tabIndex={-1}>
              Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
