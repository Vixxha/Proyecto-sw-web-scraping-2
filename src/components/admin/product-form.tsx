'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Component as Product } from '@/lib/types';
import { getProductDetails } from '@/ai/flows/get-product-details-flow';
import Spinner from '../spinner';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

// El esquema Zod ahora tiene todos los campos como opcionales, ya que la IA los llenará
const productSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  sku: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Debe ser una URL válida.' }).optional().or(z.literal('')),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: 'El precio debe ser un número.' }).min(0).optional()
  ),
  stock: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: 'El stock debe ser un número.' }).int().min(0).optional()
  ),
  specs: z.record(z.string(), z.union([z.string(), z.number()])).optional()
});


export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  product: (Product & { id: string }) | null;
}

export default function ProductForm({ isOpen, onOpenChange, onSubmit, product }: ProductFormProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [aiData, setAiData] = useState<Partial<ProductFormData> | null>(null);
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', sku: '', brand: '', category: '', description: '', imageUrl: '', price: 0, stock: 0, specs: {} },
  });

  const productName = useWatch({ control: form.control, name: 'name' });

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      });
      setAiData(null);
    } else {
      form.reset({ name: '', sku: '', brand: '', category: '', description: '', imageUrl: '', price: 0, stock: 0, specs: {} });
      setAiData(null);
    }
  }, [product, form, isOpen]);
  
  const handleFetchDetails = async () => {
    if (!productName || productName.trim().length < 5) {
       toast({ variant: 'destructive', title: 'Error', description: 'Por favor, introduce un nombre de producto más descriptivo.' });
       return;
    }
    setIsFetching(true);
    setAiData(null);
    try {
        const details = await getProductDetails(productName);
        setAiData(details);
        form.reset({
            name: productName, // Mantener el nombre que el usuario escribió
            ...details
        });
        toast({ title: '¡Detalles encontrados!', description: 'La IA ha rellenado el formulario por ti.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error de IA', description: 'No se pudieron obtener los detalles del producto.' });
    } finally {
        setIsFetching(false);
    }
  };
  
  const handleFormSubmit = (data: ProductFormData) => {
    const finalData = { ...aiData, ...data };
    onSubmit(finalData);
  };

  const formTitle = product ? 'Editar Producto' : 'Añadir Nuevo Producto';
  const formDescription = product ? 'Actualiza los detalles del producto.' : 'Describe un producto y deja que la IA haga el resto.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <div className="flex gap-2">
                    <FormControl><Input {...field} placeholder="Ej: Intel Core i9-14900K" disabled={!!product} /></FormControl>
                    {!product && (
                        <Button type="button" onClick={handleFetchDetails} disabled={isFetching}>
                            {isFetching ? <Spinner className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(isFetching || aiData || product) && (
            <div className="space-y-4 pt-4 border-t">
              {isFetching && <div className="flex justify-center"><Spinner /></div>}
              {(aiData || product) && (
                <>
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertTitle>Datos Sugeridos por la IA</AlertTitle>
                  <AlertDescription>
                    Revisa los datos autocompletados antes de guardar.
                  </AlertDescription>
                </Alert>

                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl><Textarea {...field} rows={4} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>URL de la Imagen</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="sku" render={({ field }) => (
                        <FormItem><FormLabel>SKU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="brand" render={({ field }) => (
                        <FormItem><FormLabel>Marca</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                     <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem><FormLabel>Precio (CLP)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="stock" render={({ field }) => (
                        <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Categoría</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 {((aiData?.specs && Object.keys(aiData.specs).length > 0) || (product?.specs && Object.keys(product.specs).length > 0)) && (
                    <div className="space-y-2">
                        <Label>Especificaciones</Label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 border rounded-md">
                            {Object.entries(form.getValues('specs') || {}).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                    <p className="font-semibold">{key}</p>
                                    <p className="text-muted-foreground">{String(value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                </>
              )}
            </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={isFetching || (!product && !aiData)}>
                {product ? 'Guardar Cambios' : 'Crear Producto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
