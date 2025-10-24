
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Cpu, Dices, HardDrive, MemoryStick, PcCase, Power, Video, Trash2, LoaderCircle } from 'lucide-react';
import { buildPc } from '@/ai/flows/build-pc-flow';
import type { Component } from '@/lib/types';
import { components as allComponents } from '@/lib/data';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const componentMap = new Map(allComponents.map(c => [c.slug, c]));

type Category = 'CPU' | 'Motherboard' | 'RAM' | 'GPU' | 'Storage' | 'Power Supply' | 'Case';

const categoryIcons: Record<Category, React.ReactNode> = {
  CPU: <Cpu className="h-8 w-8 text-primary" />,
  Motherboard: <Dices className="h-8 w-8 text-primary" />,
  RAM: <MemoryStick className="h-8 w-8 text-primary" />,
  GPU: <Video className="h-8 w-8 text-primary" />,
  Storage: <HardDrive className="h-8 w-8 text-primary" />,
  'Power Supply': <Power className="h-8 w-8 text-primary" />,
  Case: <PcCase className="h-8 w-8 text-primary" />,
};

export default function AIBuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [suggestedBuild, setSuggestedBuild] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateBuild = async () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, describe la PC que quieres construir.',
      });
      return;
    }
    setIsLoading(true);
    setSuggestedBuild(null);
    try {
      const result = await buildPc(prompt);
      setSuggestedBuild(result.build);
    } catch (error) {
      console.error('Error generating build:', error);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudo generar la configuración. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBestPrice = (component: Component) => {
    if (!component?.prices || component.prices.length === 0) return 0;
    return Math.min(...component.prices.map(p => p.price));
  };

  const recommendedComponents = suggestedBuild
    ? Object.entries(suggestedBuild)
        .map(([category, slug]) => {
          const component = componentMap.get(slug as string);
          return component ? { ...component, category: category as Category } : null;
        })
        .filter((c): c is Component & { category: Category } => c !== null)
    : [];

  const totalPrice = recommendedComponents.reduce((total, component) => total + getBestPrice(component), 0);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Asistente de Configuración IA
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Describe la computadora que necesitas con tus propias palabras y nuestra IA te recomendará una lista de componentes compatibles.
        </p>
      </section>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="grid gap-4">
            <Textarea
              placeholder="Ej: 'Quiero una PC para gaming en 4K y streaming. Mi presupuesto es moderado.' o 'Necesito una computadora para la universidad, económica y rápida para programar.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
            <Button onClick={handleGenerateBuild} disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generar Configuración
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center py-16">
           <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary" />
           <p className="mt-4 text-lg font-medium text-muted-foreground">La IA está pensando...</p>
           <p className="text-sm text-muted-foreground">Esto puede tardar unos segundos.</p>
        </div>
      )}

      {suggestedBuild && recommendedComponents.length > 0 && (
         <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12">
            <div className="lg:col-span-2 space-y-4">
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertTitle>¡Configuración Generada!</AlertTitle>
                  <AlertDescription>
                    Esta es la recomendación de nuestra IA basada en tu descripción. Puedes revisar los detalles de cada componente.
                  </AlertDescription>
                </Alert>

                {recommendedComponents.map((component) => (
                    <Card key={component.id} className="shadow-sm">
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                {categoryIcons[component.category]}
                                <div>
                                    <p className="font-semibold">{component.name}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{component.category}</Badge>
                                        <p className="text-sm text-muted-foreground">{component.brand}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                    ${getBestPrice(component).toLocaleString('es-CL')}
                                </p>
                                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                                    <Link href={`/components/${component.slug}`} target="_blank">Ver detalles</Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">Total Estimado</h3>
                    <p className="text-4xl font-bold text-primary mt-2 mb-4">${totalPrice.toLocaleString('es-CL')}</p>
                    <Button className="w-full" size="lg">Guardar Configuración (Próximamente)</Button>
                  </CardContent>
                </Card>
            </div>
         </div>
      )}
    </div>
  );
}
