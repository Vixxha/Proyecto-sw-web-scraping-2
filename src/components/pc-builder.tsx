
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { Component, PriceEntry } from '@/lib/types';
import { Cpu, Dices, HardDrive, MemoryStick, Video, Power, PcCase, PlusCircle, Trash2, Download, Save, LoaderCircle } from 'lucide-react';
import ComponentPicker from './component-picker';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

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
    CPU: [], Motherboard: [], RAM: [], GPU: [], Storage: [], 'Power Supply': [], Case: [],
  });
  const [buildName, setBuildName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

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

  const handleSaveBuild = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Debes iniciar sesión",
            description: "Para guardar tu configuración, necesitas una cuenta.",
        });
        router.push('/login');
        return;
    }
    if (!buildName.trim()) {
        toast({
            variant: "destructive",
            title: "Falta el nombre",
            description: "Por favor, dale un nombre a tu configuración.",
        });
        return;
    }
     if (totalPrice === 0) {
        toast({
            variant: "destructive",
            title: "Configuración vacía",
            description: "Añade al menos un componente para guardarla.",
        });
        return;
    }

    setIsSaving(true);
    try {
        const buildsCollectionRef = collection(firestore, 'users', user.uid, 'builds');
        const componentsToSave = Object.entries(selectedComponents).reduce((acc, [category, comps]) => {
            acc[category as Category] = comps.map(c => c.slug); // Guardamos solo los slugs
            return acc;
        }, {} as Record<Category, string[]>);
        
        await addDoc(buildsCollectionRef, {
            userId: user.uid,
            name: buildName,
            components: componentsToSave,
            totalPrice: totalPrice,
            createdAt: serverTimestamp(),
        });

        toast({
            title: "¡Configuración guardada!",
            description: `Tu configuración "${buildName}" ha sido guardada en tu perfil.`,
        });
        router.push('/my-builds');

    } catch (error) {
        console.error("Error saving build: ", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar la configuración. Inténtalo de nuevo.",
        });
    } finally {
        setIsSaving(false);
    }
  };


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

    worksheet['!cols'] = [
        { wch: 20 }, { wch: 50 }, { wch: 20 }, { wch: 15 }, { wch: 50 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mi Configuración');
    
    XLSX.writeFile(workbook, 'configuracion-pc.xlsx');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-4">
         {!user && (
            <Alert>
                <HardDrive className="h-4 w-4" />
                <AlertTitle>Inicia sesión para guardar</AlertTitle>
                <AlertDescription>
                    Crea una cuenta o inicia sesión para poder guardar y ver tus configuraciones de PC.
                </AlertDescription>
            </Alert>
        )}
        {componentCategories.map(({ id, name, icon, allowMultiple }) => {
          const selectedItems = selectedComponents[id];
          const getButtonText = () => allowMultiple ? (selectedItems.length > 0 ? 'Añadir otro' : 'Elegir') : (selectedItems.length > 0 ? 'Cambiar' : 'Elegir');

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
                    <div key={`${selected.id}-${index}`} className="border-t pt-4 flex justify-between items-center">
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
            <div className="grid gap-2">
                <Label htmlFor="build-name">Nombre de la Configuración</Label>
                <Input 
                    id="build-name" 
                    placeholder="Ej: Mi PC Gamer" 
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    disabled={!user}
                />
            </div>
            {componentCategories.map(({ id, name }) => {
                const components = selectedComponents[id];
                const count = components.length;
                return (
                    <div key={id} className="flex justify-between items-center text-sm border-t pt-2 mt-2">
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
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-primary">${totalPrice.toLocaleString('es-CL')}</span>
            </div>
            <div className="w-full flex flex-col gap-2">
                <Button className="w-full" size="lg" onClick={handleSaveBuild} disabled={isSaving || totalPrice === 0}>
                    {isSaving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Guardando...' : 'Guardar Configuración'}
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
