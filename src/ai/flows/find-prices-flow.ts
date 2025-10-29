
'use server';

/**
 * @fileOverview Flujo de Genkit para encontrar precios de un producto en tiendas chilenas.
 *
 * - findPrices - La función principal que invoca el flujo de IA para buscar precios.
 */

import { ai } from '@/ai/genkit';
import { stores } from '@/lib/data';
import { FindPricesInputSchema, FindPricesOutputSchema, type FindPricesInput, type FindPricesOutput } from './find-prices-schema';

// Proporcionamos el contexto de las tiendas disponibles a la IA
const storesContext = JSON.stringify(stores);

export async function findPrices(input: FindPricesInput): Promise<FindPricesOutput> {
  return findPricesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findPricesPrompt',
  input: { schema: FindPricesInputSchema },
  output: { schema: FindPricesOutputSchema },
  prompt: `
    Eres un asistente experto en web scraping y comparación de precios de hardware de PC en Chile.
    Tu tarea es encontrar los precios de un producto específico en las tiendas chilenas disponibles.

    Aquí está la lista de tiendas disponibles en formato JSON. DEBES usar los 'id' de estas tiendas en tu respuesta:
    ${storesContext}

    Petición del usuario:
    Busca los mejores precios para el producto: "{{productName}}".

    Reglas que DEBES seguir:
    1.  Busca en tu conocimiento de internet los precios actuales para el producto "{{productName}}" en las tiendas listadas.
    2.  Para cada precio que encuentres, crea un objeto que incluya el 'storeId' correcto de la lista, el 'price' como un número, y la 'url' directa al producto.
    3.  Si no encuentras un precio para una tienda, no la incluyas en tu respuesta.
    4.  Es muy importante que el 'storeId' coincida exactamente con uno de los 'id' del JSON de tiendas. Por ejemplo, si encuentras un precio en 'PC Factory', debes usar 'store-1'.
    5.  Tu respuesta DEBE ser un objeto JSON que se ajuste al esquema de salida, conteniendo una lista de precios. No incluyas nada más.
  `,
});

const findPricesFlow = ai.defineFlow(
  {
    name: 'findPricesFlow',
    inputSchema: FindPricesInputSchema,
    outputSchema: FindPricesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("La IA no pudo encontrar precios para este producto.");
    }
    return output;
  }
);
