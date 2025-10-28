
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Search, Dices, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { components } from '@/lib/data';
import ComponentCard from '@/components/component-card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from '@/components/ui/input';

const TypewriterPlaceholder = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const placeholderTexts = [
    "Ej: 'GeForce RTX 4090'...",
    "Ej: 'AMD Ryzen 9 7950X'...",
    "Ej: 'Gabinete ATX blanco'...",
    "Ej: 'Fuente de poder 750W'...",
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFocused) return;

    const handleTyping = () => {
      const fullText = placeholderTexts[placeholderIndex];
      let newCharIndex = charIndex;
      let timeout = isDeleting ? 50 : 120;

      if (isDeleting) {
        setCurrentPlaceholder(fullText.substring(0, newCharIndex - 1));
        newCharIndex--;
      } else {
        setCurrentPlaceholder(fullText.substring(0, newCharIndex + 1));
        newCharIndex++;
      }
      setCharIndex(newCharIndex);

      if (!isDeleting && newCharIndex === fullText.length) {
        // Pause at the end of the text
        timeout = 2000;
        setIsDeleting(true);
      } else if (isDeleting && newCharIndex === 0) {
        setIsDeleting(false);
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
        timeout = 120;
      }
      
      typingTimeoutRef.current = setTimeout(handleTyping, timeout);
    };
    
    typingTimeoutRef.current = setTimeout(handleTyping, 120);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };

  }, [charIndex, isDeleting, placeholderIndex, isFocused]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
      <form onSubmit={handleFormSubmit} className="mt-4 flex w-full max-w-lg items-center space-x-2">
        <Input
          type="text"
          placeholder={isFocused ? "Ej: 'GeForce RTX 4090'..." : currentPlaceholder}
          className="flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" /> Buscar
        </Button>
      </form>
  );
};

export default function HomePage() {
  const router = useRouter();
  const featuredComponents = components.slice(0, 8);
  const heroImage = {
      imageUrl: "https://images.unsplash.com/photo-1542729716-6d1890d980ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxnYW1pbmclMjBtb3RoZXJib2FyZHxlbnwwfHx8fDE3NjEzMzA3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "gaming motherboard"
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/components?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1 animate-fade-in">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
              <div className="flex flex-col justify-center space-y-4 animate-slide-up-delay-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
                  Construye la PC de Tus Sueños, Sin Complicaciones
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Compara precios de miles de componentes, arma tu propia configuración y encuentra las mejores ofertas de las tiendas más confiables.
                </p>
                
                <TypewriterPlaceholder onSearch={handleSearch} />

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
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group animate-slide-up-delay-2">
                 <Image
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1280/720"}
                  alt="Hero PC Build"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={heroImage?.imageHint || 'gaming pc'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Components Section */}
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
            <div className="relative pt-12">
               <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredComponents.map((component) => (
                    <CarouselItem key={component.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                       <div className="p-1 h-full">
                         <ComponentCard component={component} />
                       </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden sm:flex" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden sm:flex" />
              </Carousel>
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

        {/* Features Section */}
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
                <Card className="border-0 bg-transparent shadow-none animate-slide-up-delay-1">
                    <CardContent className="flex flex-col items-center text-center p-6">
                        <Search className="h-12 w-12 mb-4 text-primary" />
                        <h3 className="text-xl font-bold">Compara Precios</h3>
                        <p className="text-sm text-muted-foreground mt-2">Ahorra dinero encontrando el mejor precio para cada componente entre docenas de tiendas líderes.</p>
                    </CardContent>
                </Card>
                 <Card className="border-0 bg-transparent shadow-none animate-slide-up-delay-2">
                    <CardContent className="flex flex-col items-center text-center p-6">
                        <Dices className="h-12 w-12 mb-4 text-primary" />
                        <h3 className="text-xl font-bold">Arma tu Configuración</h3>
                        <p className="text-sm text-muted-foreground mt-2">Selecciona tus componentes y crea la PC de tus sueños con nuestra herramienta intuitiva.</p>
                    </CardContent>
                </Card>
                 <Card className="border-0 bg-transparent shadow-none animate-slide-up-delay-3">
                    <CardContent className="flex flex-col items-center text-center p-6">
                        <Cpu className="h-12 w-12 mb-4 text-primary" />
                        <h3 className="text-xl font-bold">Catálogo Extenso</h3>
                        <p className="text-sm text-muted-foreground mt-2">Explora un catálogo masivo y actualizado de CPUs, GPUs, placas base, y mucho más.</p>
                    </CardContent>
                </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
