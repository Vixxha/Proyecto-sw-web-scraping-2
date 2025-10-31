
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Cpu, Search, Dices, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Component } from '@/lib/types';
import { components } from '@/lib/data';
import ComponentCard from '@/components/component-card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';


function Hero() {
  const heroImage = {
      imageUrl: "https://preview.redd.it/dark-purple-desk-setup-inspiration-v0-ye2gq8w12wrf1.jpg?width=640&crop=smart&auto=webp&s=c7bfa80a6ef5bfee3ec76982f1b6dc265356eae6",
      imageHint: "gaming setup"
  };

  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
                Construye la PC de Tus Sueños, Sin Complicaciones
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
                Compara precios de miles de componentes, arma tu propia configuración y encuentra las mejores ofertas de las tiendas más confiables.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Button asChild size="lg">
                <Link href="/components">
                  <Cpu className="mr-2" /> Explorar Componentes
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/build">
                  <Dices className="mr-2" /> Arma tu PC
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group">
              <Image
              src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1280/720"}
              alt="Hero PC Build"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={heroImage?.imageHint || 'gaming pc'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}
