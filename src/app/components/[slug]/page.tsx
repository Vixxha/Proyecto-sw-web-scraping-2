import { notFound } from 'next/navigation';
import ComponentView from './component-view';
import { components } from '@/lib/data'; 
import type { Component } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Dynamically import the ComponentView to allow for client-side features
const DynamicComponentView = dynamic(() => import('./component-view'), {
  loading: () => <ComponentViewSkeleton />,
  ssr: true, // Keep SSR for initial paint
});


// Priority 1: Use generateStaticParams for Static Site Generation (SSG)
// This tells Next.js to pre-render all component pages at build time.
export async function generateStaticParams() {
  return components.map((component) => ({
    slug: component.slug,
  }));
}


async function getComponentBySlug(slug: string): Promise<(Component & { id: string }) | null> {
    // In a real-world scenario, this would be a database query.
    // For now, we find it in the local data array, which simulates fetching only one item.
    const component = components.find(c => c.slug === slug);
    if (!component) {
        console.warn(`No component found with slug: ${slug}`);
        return null;
    }
    // The local component object already has all the necessary data
    return component as Component & { id: string };
}


export default async function ComponentPage({ params }: { params: { slug: string } }) {
  const component = await getComponentBySlug(params.slug);

  if (!component) {
    notFound();
  }

  // We pass the full component object to the view
  return <DynamicComponentView initialComponent={component} />;
}

// Skeleton component to show while dynamic component is loading
function ComponentViewSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden sticky top-24 shadow-lg">
            <Skeleton className="aspect-square w-full" />
          </Card>
        </div>
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
               <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
               <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// We need to export Card components for the skeleton
import { Card, CardHeader, CardContent } from '@/components/ui/card';
