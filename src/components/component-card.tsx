import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Component } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface ComponentCardProps {
  component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const bestPrice = component.prices.length > 0
    ? Math.min(...component.prices.map(p => p.price))
    : null;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={component.imageUrl}
            alt={component.name}
            fill
            className="object-cover"
            data-ai-hint={component.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary">{component.category}</Badge>
            {bestPrice !== null && (
              <p className="text-xl font-bold text-primary">
                ${bestPrice.toFixed(2)}
              </p>
            )}
        </div>
        <CardTitle className="text-lg leading-tight mt-2 mb-1 h-12 line-clamp-2">{component.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{component.brand}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/components/${component.slug}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
