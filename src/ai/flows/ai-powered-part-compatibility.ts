'use server';
/**
 * @fileOverview Provides AI-powered suggestions for compatible PC parts.
 *
 * - getCompatibleParts - A function that suggests compatible parts for a given component.
 * - CompatiblePartsInput - The input type for the getCompatibleParts function.
 * - CompatiblePartsOutput - The return type for the getCompatibleParts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompatiblePartsInputSchema = z.object({
  componentType: z.string().describe('The type of the PC component (e.g., CPU, motherboard, RAM).'),
  componentName: z.string().describe('The name or model of the PC component.'),
  componentDetails: z.string().optional().describe('Additional details about the component, such as specifications or intended use.'),
});
export type CompatiblePartsInput = z.infer<typeof CompatiblePartsInputSchema>;

const CompatiblePartsOutputSchema = z.object({
  compatibleParts: z.array(
    z.object({
      partType: z.string().describe('The type of the compatible part.'),
      partName: z.string().describe('The name or model of the compatible part.'),
      reason: z.string().describe('The reason why this part is compatible with the input component.'),
    })
  ).describe('A list of compatible parts with reasons for compatibility.'),
  potentialIssues: z.array(z.string()).optional().describe('A list of potential compatibility issues, if any.'),
});
export type CompatiblePartsOutput = z.infer<typeof CompatiblePartsOutputSchema>;

export async function getCompatibleParts(input: CompatiblePartsInput): Promise<CompatiblePartsOutput> {
  return compatiblePartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compatiblePartsPrompt',
  input: {schema: CompatiblePartsInputSchema},
  output: {schema: CompatiblePartsOutputSchema},
  prompt: `You are an AI assistant that helps users find compatible PC parts.

  Given the following PC component, suggest a list of compatible parts.
  Explain the reasons for compatibility. If there are potential compatibility issues, list them.

  Component Type: {{{componentType}}}
  Component Name: {{{componentName}}}
  Component Details: {{{componentDetails}}}

  Format your output as a JSON object matching the following schema:
  ${JSON.stringify(CompatiblePartsOutputSchema)}
  `,
});

const compatiblePartsFlow = ai.defineFlow(
  {
    name: 'compatiblePartsFlow',
    inputSchema: CompatiblePartsInputSchema,
    outputSchema: CompatiblePartsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
