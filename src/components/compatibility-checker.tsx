"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCompatibleParts, CompatiblePartsOutput } from '@/ai/flows/ai-powered-part-compatibility';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Cpu, Dices, HardDrive, MemoryStick, TriangleAlert } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  componentType: z.string().min(1, 'Please select a component type.'),
  componentName: z.string().min(2, 'Component name is required.'),
  componentDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CompatibilityChecker() {
  const [result, setResult] = useState<CompatiblePartsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentType: '',
      componentName: '',
      componentDetails: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getCompatibleParts(values);
      setResult(response);
    } catch (e) {
      setError('An error occurred while fetching compatibility data. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const PartIcon = ({ partType }: { partType: string }) => {
    const lowerCaseType = partType.toLowerCase();
    if (lowerCaseType.includes('cpu') || lowerCaseType.includes('processor')) {
      return <Cpu className="h-5 w-5 text-muted-foreground" />;
    }
    if (lowerCaseType.includes('motherboard')) {
      return <Dices className="h-5 w-5 text-muted-foreground" />;
    }
    if (lowerCaseType.includes('ram') || lowerCaseType.includes('memory')) {
        return <MemoryStick className="h-5 w-5 text-muted-foreground" />;
    }
    if (lowerCaseType.includes('storage') || lowerCaseType.includes('ssd') || lowerCaseType.includes('hdd')) {
        return <HardDrive className="h-5 w-5 text-muted-foreground" />;
    }
    return <Cpu className="h-5 w-5 text-muted-foreground" />;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Check Component</CardTitle>
            <CardDescription>
              Enter a component to find compatible parts.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="componentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CPU">CPU</SelectItem>
                          <SelectItem value="Motherboard">Motherboard</SelectItem>
                          <SelectItem value="RAM">RAM</SelectItem>
                          <SelectItem value="GPU">GPU</SelectItem>
                          <SelectItem value="Storage">Storage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="componentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Intel Core i9-13900K" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="componentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., For a gaming build with DDR5 memory" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Checking...' : 'Find Compatible Parts'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle>Compatibility Results</CardTitle>
            <CardDescription>
              AI-powered suggestions will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
               <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <div className="space-y-6">
                {result.potentialIssues && result.potentialIssues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-destructive">Potential Issues</h3>
                    <Alert variant="destructive">
                      <TriangleAlert className="h-4 w-4" />
                      <AlertTitle>Heads up!</AlertTitle>
                       <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            {result.potentialIssues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                       </AlertDescription>
                    </Alert>
                  </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold mb-2">Compatible Parts</h3>
                    <Accordion type="single" collapsible className="w-full">
                    {result.compatibleParts.map((part, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-3">
                                <PartIcon partType={part.partType} />
                                <div>
                                    <p className="font-semibold text-left">{part.partName}</p>
                                    <p className="text-sm text-muted-foreground text-left">{part.partType}</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-sm text-muted-foreground pl-4 border-l-2 border-primary ml-2 py-2">
                                {part.reason}
                            </p>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </div>

                {result.compatibleParts.length === 0 && !result.potentialIssues && (
                     <div className="text-center py-10">
                        <p className="text-muted-foreground">No specific compatibility results found.</p>
                     </div>
                )}
              </div>
            )}
            {!isLoading && !result && !error && (
                <div className="text-center py-16 text-muted-foreground">
                    <Cpu className="mx-auto h-12 w-12 mb-4"/>
                    <p>Your results are waiting.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
