
import { z } from 'genkit';

/**
 * @fileOverview Esquemas y tipos para el flujo de construcción de PC.
 *
 * - BuildPcInput - El tipo de entrada para la descripción del usuario.
 * - BuildPcOutput - El tipo de salida que contiene la configuración de PC generada.
 */

export const BuildPcInputSchema = z.string();
export type BuildPcInput = z.infer<typeof BuildPcInputSchema>;

export const BuildPcOutputSchema = z.object({
  build: z.object({
    CPU: z.string().describe('El slug del componente de CPU seleccionado.'),
    Motherboard: z.string().describe('El slug del componente de Placa Madre seleccionado.'),
    RAM: z.string().describe('El slug del componente de RAM seleccionado.'),
    GPU: z.string().describe('El slug del componente de Tarjeta de Video seleccionada.'),
    Storage: z.string().describe('El slug del componente de Almacenamiento seleccionado.'),
    'Power Supply': z.string().describe('El slug del componente de Fuente de Poder seleccionado.'),
    Case: z.string().describe('El slug del componente de Gabinete seleccionado.'),
  }).describe('Un objeto que contiene los slugs de los componentes seleccionados para cada categoría.'),
});
export type BuildPcOutput = z.infer<typeof BuildPcOutputSchema>;
