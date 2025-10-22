import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Search, Dices, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { components } from '@/lib/data';
import ComponentCard from '@/components/component-card';

export default function HomePage() {
  const featuredComponents = components.slice(0, 3);

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
                  Tu Guía Inteligente para Armar tu PC
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Compara precios de componentes, verifica la compatibilidad con IA y encuentra las mejores ofertas para construir la PC de tus sueños.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/components">
                      <Search className="mr-2" /> Empezar a Buscar
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/compatibility">
                      <Cpu className="mr-2" /> Verificador de Compatibilidad
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                 <Image
                  src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxnYW1pbmclMjBwY3xlbnwwfHx8fDE3NjExMzMyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hero PC Build"
                  fill
                  className="object-cover"
                  data-ai-hint="gaming pc"
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Componentes Destacados</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explora los componentes más populares y con mejores precios del momento.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
              {featuredComponents.map((component) => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild variant="outline">
                    <Link href="/components">
                        Ver todos los componentes <ArrowRight className="ml-2" />
                    </Link>
                </Button>
             </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Todo lo que necesitas para tu próxima PC
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Desde la comparación de precios hasta la verificación de compatibilidad con IA, te tenemos cubierto.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                <Card>
                    <CardContent className="flex flex-col items-center text-center p-6">
                        <Search className="h-10 w-10 mb-4 text-primary" />
                        <h3 className="text-lg font-bold">Comparación de Precios</h3>
                        <p className="text-sm text-muted-foreground">Encuentra el mejor precio para cada componente en diferentes tiendas.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="flex flex-col items-center text-center p-6">
                        <Cpu className="h-10 w-10 mb-4 text-primary" />
                        <h3 className="text-lg font-bold">Compatibilidad con IA</h3>
                        <p className="text-sm text-muted-foreground">Nuestra IA te ayuda a asegurar que tus componentes funcionarán juntos.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="flex flex-col items-center text-center p-6">
                        <Dices className="h-10 w-10 mb-4 text-primary" />
                        <h3 className="text-lg font-bold">Amplia Selección</h3>
                        <p className="text-sm text-muted-foreground">Explora un catálogo extenso de CPUs, GPUs, placas base y más.</p>
                    </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
