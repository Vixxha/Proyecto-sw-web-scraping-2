
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Component as Product } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  sku: z.string().min(1, { message: 'El SKU es obligatorio.' }),
  brand: z.string().min(2, { message: 'La marca es obligatoria.' }),
  category: z.string().min(2, { message: 'La categoría es obligatoria.' }),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: 'El precio debe ser un número.' }).min(0, 'El precio no puede ser negativo.')
  ),
  stock: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: 'El stock debe ser un número.' }).int('El stock debe ser un número entero.').min(0, 'El stock no puede ser negativo.')
  ),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  product: (Product & { id: string }) | null;
}

export default function ProductForm({ isOpen, onOpenChange, onSubmit, product }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      brand: '',
      category: 'CPU', // Default category
      description: '',
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        sku: product.sku,
        brand: product.brand,
        category: product.category,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
      });
    } else {
      form.reset({
        name: '',
        sku: '',
        brand: '',
        category: 'CPU',
        description: '',
        price: 0,
        stock: 0,
      });
    }
  }, [product, form, isOpen]);

  const formTitle = product ? 'Editar Producto' : 'Añadir Nuevo Producto';
  const formDescription = product ? 'Actualiza los detalles del producto.' : 'Completa el formulario para añadir un producto.';
  const buttonText = product ? 'Guardar Cambios' : 'Crear Producto';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Precio</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Stock</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Categoría</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{buttonText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
