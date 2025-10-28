
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { Component, PriceEntry } from '@/lib/types';
import { Cpu, Dices, HardDrive, MemoryStick, Video, Power, PcCase, PlusCircle, Trash2, Download } from 'lucide-react';
import ComponentPicker from './component-picker';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

type Category = 'CPU' | 'Motherboard' | 'RAM' | 'GPU' | 'Storage' | 'Power Supply' | 'Case';

const componentCategories: { id: Category; name: string; icon: React.ReactNode, allowMultiple: boolean }[] = [
  { id: 'CPU', name: 'Procesador', icon: <Cpu className="h-8 w-8 text-primary" />, allowMultiple: false },
  { id: 'Motherboard', name: 'Placa Madre', icon: <Dices className="h-8 w-8 text-primary" />, allowMultiple: false },
  { id: 'RAM', name: 'Memoria RAM', icon: <MemoryStick className="h-8 w-8 text-primary" />, allowMultiple: true },
  { id: 'GPU', name: 'Tarjeta de Video', icon: <Video className="h-8 w-8 text-primary" />, allowMultiple: false },
  { id: 'Storage', name: 'Almacenamiento', icon: <HardDrive className="h-8 w-8 text-primary" />, allowMultiple: true },
  { id: 'Power Supply', name: 'Fuente de Poder', icon: <Power className="h-8 w-8 text-primary" />, allowMultiple: false },
  { id: 'Case', name: 'Gabinete', icon: <PcCase className="h-8 w-8 text-primary" />, allowMultiple: false },
];

export function PCBuilder() {
  const [selectedComponents, setSelectedComponents] = useState<Record<Category, Component[]>>({
    CPU: [],
    Motherboard: [],
    RAM: [],
    GPU: [],
    Storage: [],
    'Power Supply': [],
    Case: [],
  });

  const handleSelectComponent = (category: Category, component: Component) => {
    const categoryInfo = componentCategories.find(c => c.id === category);
    setSelectedComponents(prev => {
        const currentComponents = prev[category];
        if (categoryInfo?.allowMultiple) {
            return { ...prev, [category]: [...currentComponents, component] };
        }
        return { ...prev, [category]: [component] };
    });
  };
  
  const handleRemoveComponent = (category: Category, indexToRemove: number) => {
    setSelectedComponents(prev => {
        const updatedComponents = prev[category].filter((_, index) => index !== indexToRemove);
        return { ...prev, [category]: updatedComponents };
    });
  };

  const getBestPriceEntry = (component: Component): PriceEntry | null => {
    if (!component?.prices || component.prices.length === 0) return null;
    return component.prices.reduce((best, current) => current.price < best.price ? current : best, component.prices[0]);
  };
  
  const getBestPrice = (component: Component) => {
    return getBestPriceEntry(component)?.price || 0;
  };

  const totalPrice = useMemo(() => {
    return Object.values(selectedComponents).flat().reduce((total, component) => {
      return total + getBestPrice(component);
    }, 0);
  }, [selectedComponents]);

  const handleDownloadXLSX = () => {
    const dataForSheet = Object.entries(selectedComponents).flatMap(([category, components]) => 
        components.map(component => {
            const bestPriceEntry = getBestPriceEntry(component);
            return {
                'Categoría': category,
                'Componente': component.name,
                'Marca': component.brand,
                'Precio': bestPriceEntry?.price || 0,
                'Link': bestPriceEntry?.url || 'N/A',
            };
        })
    );
    
    if (dataForSheet.length > 0) {
      dataForSheet.push({
          'Categoría': '',
          'Componente': '',
          'Marca': 'Total',
          'Precio': totalPrice,
          'Link': '',
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(dataForSheet, {
        header: ['Categoría', 'Componente', 'Marca', 'Precio', 'Link']
    });

    // Set column widths
    worksheet['!cols'] = [
        { wch: 20 }, // Categoría
        { wch: 50 }, // Componente
        { wch: 20 }, // Marca
        { wch: 15 }, // Precio
        { wch: 50 }, // Link
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mi Configuración');
    
    XLSX.writeFile(workbook, 'configuracion-pc.xlsx');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-4">
        {componentCategories.map(({ id, name, icon, allowMultiple }) => {
          const selectedItems = selectedComponents[id];
          
          const getButtonText = () => {
            if (allowMultiple) {
                return selectedItems.length > 0 ? 'Añadir otro' : 'Elegir';
            }
            return selectedItems.length > 0 ? 'Cambiar' : 'Elegir';
          };

          return (
            <Card key={id} className="shadow-none border">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {icon}
                  <h3 className="text-lg font-semibold">{name}</h3>
                   {selectedItems.length > 0 && <Badge variant="secondary">{selectedItems.length} seleccionado{selectedItems.length > 1 ? 's' : ''}</Badge>}
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                       <Button variant={!allowMultiple && selectedItems.length > 0 ? 'outline' : 'default'}>
                         <PlusCircle className="mr-2 h-4 w-4" />
                         {getButtonText()}
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
              {selectedItems.length > 0 && (
                <CardContent className="p-4 pt-0 space-y-3">
                  {selectedItems.map((selected, index) => (
                    <div key={index} className="border-t pt-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Image src={selected.imageUrl} alt={selected.name} width={64} height={64} className="rounded-md object-cover" />
                            <div>
                                <p className="font-semibold">{selected.name}</p>
                                <p className="text-sm text-muted-foreground">{selected.brand}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-lg font-bold text-primary">
                                ${getBestPrice(selected).toLocaleString('es-CL')}
                            </p>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveComponent(id, index)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                        </div>
                    </div>
                  ))}
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
                const components = selectedComponents[id];
                const count = components.length;
                return (
                    <div key={id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{name}</span>
                        <span className={cn("font-medium text-right", count > 0 ? "text-foreground" : "text-muted-foreground")}>
                            {count > 0 ? `${count}x seleccionado${count > 1 ? 's' : ''}` : 'No seleccionado'}
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
            <div className="w-full flex flex-col gap-2">
                <Button className="w-full" size="lg" disabled={totalPrice === 0}>
                    Guardar Configuración
                </Button>
                <Button className="w-full" size="lg" variant="outline" onClick={handleDownloadXLSX} disabled={totalPrice === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar XLSX
                </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
