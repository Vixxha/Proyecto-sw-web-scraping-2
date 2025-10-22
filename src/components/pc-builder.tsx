"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { components as allComponents } from '@/lib/data';
import type { Component } from '@/lib/types';
import { Cpu, Dices, HardDrive, MemoryStick, Video, Power, Case, PlusCircle, Trash2, X } from 'lucide-react';
import ComponentPicker from './component-picker';
import Image from 'next/image';

type Category = 'CPU' | 'Motherboard' | 'RAM' | 'GPU' | 'Storage' | 'Power Supply' | 'Case';

const componentCategories: { id: Category; name: string; icon: React.ReactNode }[] = [
  { id: 'CPU', name: 'Procesador', icon: <Cpu className="h-8 w-8 text-primary" /> },
  { id: 'Motherboard', name: 'Placa Madre', icon: <Dices className="h-8 w-8 text-primary" /> },
  { id: 'RAM', name: 'Memoria RAM', icon: <MemoryStick className="h-8 w-8 text-primary" /> },
  { id: 'GPU', name: 'Tarjeta de Video', icon: <Video className="h-8 w-8 text-primary" /> },
  { id: 'Storage', name: 'Almacenamiento', icon: <HardDrive className="h-8 w-8 text-primary" /> },
  { id: 'Power Supply', name: 'Fuente de Poder', icon: <Power className="h-8 w-8 text-primary" /> },
  { id: 'Case', name: 'Gabinete', icon: <Case className="h-8 w-8 text-primary" /> },
];

export function PCBuilder() {
  const [selectedComponents, setSelectedComponents] = useState<Record<Category, Component | null>>({
    CPU: null,
    Motherboard: null,
    RAM: null,
    GPU: null,
    Storage: null,
    Power Supply: null,
    Case: null,
  });

  const handleSelectComponent = (category: Category, component: Component) => {
    setSelectedComponents(prev => ({ ...prev, [category]: component }));
  };
  
  const handleRemoveComponent = (category: Category) => {
    setSelectedComponents(prev => ({ ...prev, [category]: null }));
  };

  const totalPrice = useMemo(() => {
    return Object.values(selectedComponents).reduce((total, component) => {
      if (component) {
        const bestPrice = component.prices.length > 0
          ? Math.min(...component.prices.map(p => p.price))
          : 0;
        return total + bestPrice;
      }
      return total;
    }, 0);
  }, [selectedComponents]);

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-4">
        {componentCategories.map(({ id, name, icon }) => {
          const selected = selectedComponents[id];
          return (
            <Card key={id} className="shadow-none border">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {icon}
                  <h3 className="text-lg font-semibold">{name}</h3>
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                       <Button variant={selected ? "outline" : "default"}>
                         <PlusCircle className="mr-2 h-4 w-4" />
                         {selected ? 'Cambiar' : 'Elegir'}
                       </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh]">
                       <ComponentPicker
                         category={id}
                         onSelectComponent={(component) => handleSelectComponent(id, component)}
                       />
                    </DialogContent>
                 </Dialog>
              </CardHeader>
              {selected && (
                <CardContent className="p-4 pt-0">
                  <div className="border-t pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Image src={selected.imageUrl} alt={selected.name} width={64} height={64} className="rounded-md object-cover" />
                        <div>
                            <p className="font-semibold">{selected.name}</p>
                            <p className="text-sm text-muted-foreground">{selected.brand}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-primary">
                            ${(Math.min(...selected.prices.map(p => p.price)) || 0).toLocaleString('es-CL')}
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveComponent(id)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                     </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Resumen de tu PC</CardTitle>
            <CardDescription>Esta es tu selección actual de componentes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {componentCategories.map(({ id, name }) => {
                const component = selectedComponents[id];
                return (
                    <div key={id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{name}</span>
                        <span className={cn("font-medium", component ? "text-foreground" : "text-muted-foreground")}>
                            {component ? '✓ Seleccionado' : 'No seleccionado'}
                        </span>
                    </div>
                )
            })}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <div className="flex justify-between items-center w-full">
              <span className="text-xl font-bold">Precio Total Estimado:</span>
              <span className="text-2xl font-bold text-primary">${totalPrice.toLocaleString('es-CL')}</span>
            </div>
            <Button className="w-full" size="lg" disabled={totalPrice === 0}>
                Guardar Configuración
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
