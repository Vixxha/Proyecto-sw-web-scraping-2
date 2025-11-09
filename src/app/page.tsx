'use client';

import { Button } from '@/components/ui/button';
import { Cpu, Dices, ArrowRight, Scale, Bot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

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
              sizes="100vw"
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

function Features() {
  const features = [
    {
      icon: <Scale className="w-10 h-10 text-primary" />,
      title: "Compara Precios",
      description: "Encuentra el mejor precio para cada componente comparando entre las principales tiendas del país.",
      href: "/components"
    },
    {
      icon: <Dices className="w-10 h-10 text-primary" />,
      title: "Arma tu Configuración",
      description: "Usa nuestro constructor para elegir tus componentes y verificar su compatibilidad al instante.",
       href: "/build"
    },
    {
      icon: <Bot className="w-10 h-10 text-primary" />,
      title: "Asistente con IA",
      description: "Describe la PC que necesitas y nuestra IA te recomendará la configuración perfecta para tu presupuesto.",
       href: "/ai-builder"
    }
  ]

  return (
    <section className="w-full py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
         <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Todo lo que necesitas en un solo lugar</h2>
            <p className="mt-4 text-lg text-muted-foreground">Desde la comparación de precios hasta la construcción asistida por IA, tenemos las herramientas para tu próxima PC.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
          {features.map((feature) => (
             <div key={feature.title} className="text-center p-6 rounded-lg">
                <div className="inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                 <Button asChild variant="link" className="inline-flex items-center">
                    <Link href={feature.href}>
                        Empezar <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandShowcase() {
  const brands = [
    { name: 'NVIDIA', logo: 'https://cdn.worldvectorlogo.com/logos/nvidia.svg' },
    { name: 'AMD', logo: 'https://cdn.freebiesupply.com/logos/large/2x/amd-4-logo-png-transparent.png' },
    { name: 'Intel', logo: 'https://cdn.worldvectorlogo.com/logos/intel-7.svg' },
    { name: 'ASUS', logo: 'https://press.asus.com/assets/w_640,h_640/9c932348-92e9-4450-88a0-2b22bb1d63ca/ROG-logo-black.png' },
    { name: 'Corsair', logo: 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_K.png' },
    { name: 'Gigabyte', logo: 'https://cdn.worldvectorlogo.com/logos/gigabyte-1.svg' },
    { name: 'MSI', logo: 'https://www.notebookcheck.org/fileadmin/Notebooks/News/_nc3/MSI_logo_for_share2.png' },
    { name: 'Samsung', logo: 'https://cdn.worldvectorlogo.com/logos/samsung-5.svg' },
    { name: 'SeaSonic', logo: 'https://www.seasonic.com/pub/media/logo/default/logo.png' },
    { name: 'NZXT', logo: 'https://nzxt.com/assets/developer/brand-assets/nzxt-logo-wordmark-white.png?v=1' },
  ];

  return (
    <section className="w-full py-20 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Las Mejores Marcas, Todas en un Mismo Lugar</h2>
          <p className="mt-4 text-lg text-muted-foreground">Trabajamos con los líderes de la industria para ofrecerte la selección más completa de componentes de alta calidad.</p>
        </div>
        <div 
          className="relative mt-12 w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="flex animate-infinite-scroll">
            {[...brands, ...brands].map((brand, index) => (
              <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center" style={{ width: '150px' }}>
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={50}
                  className="object-contain filter grayscale transition duration-300 hover:grayscale-0"
                  style={{ height: 'auto' }}
                />
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes infinite-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .animate-infinite-scroll {
              animation: infinite-scroll 40s linear infinite;
            }
            .filter { filter: grayscale(1); }
            .hover\\:grayscale-0:hover { filter: grayscale(0); }
            .dark img {
                filter: grayscale(1) invert(1) brightness(1.5);
            }
             .dark img:hover {
                filter: grayscale(0) invert(0) brightness(1);
            }
            img[src*="nvidia"], img[src*="amd"], img[src*="intel-7"], img[src*="gigabyte"], img[src*="samsung"] {
                filter: grayscale(1);
            }
             img[src*="nvidia"]:hover, img[src*="amd"]:hover, img[src*="intel-7"]:hover, img[src*="gigabyte"]:hover, img[src*="samsung"]:hover {
                filter: grayscale(0);
            }
             .dark img[src*="nvidia"], .dark img[src*="amd"], .dark img[src*="intel-7"], .dark img[src*="gigabyte"], .dark img[src*="samsung"] {
                filter: grayscale(1) brightness(1.5);
             }
             .dark img[src*="nvidia"]:hover, .dark img[src*="amd"]:hover, .dark img[src*="intel-7"]:hover, .dark img[src*="gigabyte"]:hover, .dark img[src*="samsung"]:hover {
                 filter: grayscale(0) brightness(1);
             }
          `}</style>
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
        <Features />
        <BrandShowcase />
      </main>
    </div>
  );
}
