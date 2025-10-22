'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Component, Category } from '@/lib/types';

const categories: Category[] = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case'];

const formSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  sku: z.string().min(1, 'El SKU es requerido.'),
  brand: z.string().min(2, 'La marca es requerida.'),
  category: z.enum(categories, {
    errorMap: () => ({ message: 'Por favor selecciona una categoría válida.' }),
  }),
  imageUrl: z.string().url('Debe ser una URL válida.'),
  description: z.string().optional(),
});

type ComponentFormValues = z.infer<typeof formSchema>;

interface ComponentFormProps {
  initialData?: Component;
  onSubmit: (data: any) => void;
}

export default function ComponentForm({ initialData, onSubmit }: ComponentFormProps) {
  const form = useForm<ComponentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      sku: '',
      brand: '',
      category: undefined,
      imageUrl: '',
      description: '',
    },
  });

  const handleSubmit = (values: ComponentFormValues) => {
    // We can expand the submitted data with more complex logic later
    const specs = {};
    const fullComponentData = {
        ...values,
        specs,
    };
    onSubmit(fullComponentData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Componente</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Intel Core i9-13900K" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: BX8071513900K" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Ej: Intel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la Imagen</FormLabel>
                <FormControl>
                  <Input placeholder="https://ejemplo.com/imagen.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Componente'}
        </Button>
      </form>
    </Form>
  );
}
