
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

function FeaturedComponents({ components }: { components: Component[] }) {
  const featuredComponents = components.slice(0, 8);
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
              <Badge variant="outline">Lo más popular</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Componentes Destacados</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explora los componentes más buscados y con mejores precios del momento. Nuestra selección se actualiza constantemente.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-12">
            {featuredComponents.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
        </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/components">
                    Ver todos los componentes <ArrowRight className="ml-2" />
                </Link>
            </Button>
          </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Tu Aliado #1 para Armar tu PC
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Desde la comparación de precios hasta el armado de tu propia configuración, tenemos todo lo que necesitas en un solo lugar.
              </p>
          </div>
        </div>
        <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-12">
            <div className="flex flex-col items-center text-center p-6">
                <Search className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Compara Precios</h3>
                <p className="text-sm text-muted-foreground mt-2">Ahorra dinero encontrando el mejor precio para cada componente entre docenas de tiendas líderes.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
                <Dices className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Arma tu Configuración</h3>
                <p className="text-sm text-muted-foreground mt-2">Selecciona tus componentes y crea la PC de tus sueños con nuestra herramienta intuitiva.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
                <Cpu className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Catálogo Extenso</h3>
                <p className="text-sm text-muted-foreground mt-2">Explora un catálogo masivo y actualizado de CPUs, GPUs, placas base, y mucho más.</p>
            </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  // In a real app, this data would be fetched from an API.
  // We are passing it as a prop to avoid including it in the client bundle.
  const allComponents = components;

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <Hero />
        <FeaturedComponents components={allComponents} />
        <Features />
      </main>
    </div>
  );
}
