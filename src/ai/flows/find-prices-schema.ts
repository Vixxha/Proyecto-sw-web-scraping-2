
import { z } from 'genkit';

/**
 * @fileOverview Esquemas y tipos para el flujo de búsqueda de precios.
 *
 * - FindPricesInput - El tipo de entrada para la búsqueda de precios.
 * - FindPricesOutput - El tipo de salida con la lista de precios encontrados.
 */

// Esquema para la entrada del flujo
export const FindPricesInputSchema = z.object({
  productName: z.string().describe('El nombre o SKU del producto a buscar.'),
});
export type FindPricesInput = z.infer<typeof FindPricesInputSchema>;

// Esquema para un único precio encontrado
const PriceResultSchema = z.object({
  storeId: z.string().describe('El ID de la tienda (ej. store-1, store-2).'),
  price: z.number().describe('El precio encontrado en la tienda.'),
  url: z.string().url().describe('El enlace directo a la página del producto en la tienda.'),
});

// Esquema para la salida del flujo
export const FindPricesOutputSchema = z.object({
  prices: z.array(PriceResultSchema).describe('Una lista de los precios encontrados en diferentes tiendas.'),
});
export type FindPricesOutput = z.infer<typeof FindPricesOutputSchema>;
