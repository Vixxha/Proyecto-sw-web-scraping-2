
'use server';

/**
 * @fileOverview Flujo de Genkit para generar una configuración de PC basada en la descripción del usuario.
 *
 * - buildPc - La función principal que invoca el flujo de IA.
 */

import { ai } from '@/ai/genkit';
import { components } from '@/lib/data';
import { BuildPcInputSchema, BuildPcOutputSchema, type BuildPcInput, type BuildPcOutput } from './build-pc-schema';


// Simplificamos los datos de los componentes para que sean más fáciles de procesar por el modelo.
const componentContext = JSON.stringify(components.map(c => ({
    slug: c.slug,
    name: c.name,
    category: c.category,
    brand: c.brand,
    price: Math.min(...c.prices.map(p => p.price)) || 0,
    specs: c.specs
})));


export async function buildPc(input: BuildPcInput): Promise<BuildPcOutput> {
  return buildPcFlow(input);
}


const prompt = ai.definePrompt({
    name: 'buildPcPrompt',
    input: { schema: BuildPcInputSchema },
    output: { schema: BuildPcOutputSchema },
    prompt: `
        Eres un experto de clase mundial en hardware de computadoras y armado de PCs.
        Tu tarea es ayudar a un usuario a construir una PC recomendando una lista de componentes compatibles
        basada en su descripción de necesidades y presupuesto.

        Aquí tienes la lista de componentes disponibles en formato JSON:
        ${componentContext}

        Reglas importantes que DEBES seguir:
        1.  **Compatibilidad es REY**: La compatibilidad entre componentes es la máxima prioridad.
            *   El socket de la CPU DEBE ser compatible con el socket de la Placa Madre (Motherboard). Por ejemplo, una CPU 'LGA1700' necesita una placa 'LGA1700'.
            *   El tipo de memoria de la Placa Madre (ej. 'DDR5') DEBE ser compatible con el tipo de memoria RAM.
            *   La Tarjeta de Video (GPU) debe ser físicamente compatible con la Placa Madre (prácticamente todas las modernas lo son con PCIe).
            *   La Fuente de Poder (Power Supply) debe tener suficiente potencia (Wattage) para todo el sistema, especialmente la CPU y la GPU. Sé conservador y elige una con un poco más de margen.
            *   Todos los componentes deben caber en el Gabinete (Case). Presta atención a los factores de forma (ej. ATX, Micro-ATX). Una placa ATX no cabe en un gabinete Micro-ATX.

        2.  **Analiza la Petición del Usuario**: Lee cuidadosamente la descripción del usuario para entender su objetivo principal (gaming, trabajo, estudio, edición de video, etc.) y su presupuesto (alto, medio, bajo, económico).

        3.  **Selecciona UN componente para CADA categoría**: Debes devolver exactamente un componente para cada una de las siguientes 7 categorías: 'CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'Power Supply', 'Case'.

        4.  **Optimiza la Configuración**:
            *   Si el usuario quiere una PC para **gaming**, prioriza la GPU, luego la CPU.
            *   Si es para **productividad/trabajo/edición**, prioriza una CPU con muchos núcleos, luego la RAM.
            *   Si el **presupuesto es bajo**, busca el mejor rendimiento por el precio, sacrificando lujos. No tienes que elegir siempre lo más barato, sino lo que tenga mejor valor.

        5.  **Formato de Salida**: Tu respuesta DEBE ser un objeto JSON que se ajuste al esquema de salida, conteniendo un objeto 'build' con los slugs de los 7 componentes seleccionados. No incluyas nada más en tu respuesta.

        Petición del usuario:
        "{{{input}}}"
    `,
});

const buildPcFlow = ai.defineFlow(
    {
      name: 'buildPcFlow',
      inputSchema: BuildPcInputSchema,
      outputSchema: BuildPcOutputSchema,
    },
    async (input) => {
      const { output } = await prompt(input);
      if (!output) {
          throw new Error("La IA no pudo generar una configuración.");
      }
      return output;
    }
);
