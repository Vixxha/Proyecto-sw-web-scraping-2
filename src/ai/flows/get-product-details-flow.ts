'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductDetailsSchema = z.object({
  sku: z.string().describe('El SKU (Stock Keeping Unit) del producto, si lo encuentras.'),
  brand: z.string().describe('La marca del producto.'),
  category: z.enum(['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case', 'Cooling', 'Other']).describe('La categoría del producto.'),
  description: z.string().describe('Una descripción concisa pero informativa del producto.'),
  imageUrl: z.string().url().describe('Una URL a una imagen de alta calidad del producto.'),
  price: z.number().describe('Un precio estimado y razonable en pesos chilenos (CLP). No uses separadores de miles.'),
  stock: z.number().int().describe('Una cantidad de stock inicial razonable, por ejemplo 50.'),
  specs: z.record(z.string(), z.union([z.string(), z.number()])).describe('Un objeto con las especificaciones técnicas clave del producto. Por ejemplo, para una CPU: { Socket: "LGA1700", Cores: "24" }.'),
});

export type ProductDetails = z.infer<typeof ProductDetailsSchema>;

export async function getProductDetails(productName: string): Promise<ProductDetails> {
  const prompt = ai.definePrompt({
    name: 'productDetailsPrompt',
    input: { schema: z.string() },
    output: { schema: ProductDetailsSchema },
    prompt: `
        Eres un asistente experto en hardware de PC encargado de poblar un catálogo de productos.
        Dado el nombre de un producto, tu tarea es buscar en tu conocimiento de internet y devolver
        un objeto JSON estructurado con todos sus detalles.

        Reglas importantes:
        1.  **Completa TODOS los campos**: Debes proporcionar un valor para 'sku', 'brand', 'category', 'description', 'imageUrl', 'price', 'stock', y 'specs'.
        2.  **Sé preciso**: La información debe ser lo más precisa y actualizada posible.
        3.  **Precio en CLP**: El precio debe ser un número entero que represente el valor en pesos chilenos.
        4.  **Especificaciones clave**: Incluye solo las 3-5 especificaciones más importantes y reconocibles para ese tipo de componente. No sobrecargues con datos oscuros.
        5.  **Categoría**: Usa una de las categorías predefinidas. Si no encaja, usa 'Other'.

        Nombre del producto: "{{input}}"
    `,
  });

  const { output } = await prompt(productName);
  if (!output) {
    throw new Error('La IA no pudo generar los detalles del producto.');
  }
  return output;
}
