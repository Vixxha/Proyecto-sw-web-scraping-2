import { notFound } from 'next/navigation';
import ComponentView from './component-view';
import { components } from '@/lib/data'; // Import local data
import type { Component } from '@/lib/types';


// This function can be used to generate static paths at build time
export async function generateStaticParams() {
  // Generate params from the local data
  return components.map(component => ({
    slug: component.slug,
  }));
}

async function getComponentBySlug(slug: string): Promise<(Component & { id: string }) | null> {
    try {
        const component = components.find(c => c.slug === slug);
        if (component) {
            return component as Component & { id: string };
        }
        return null;

    } catch (error) {
        console.error("Error fetching component by slug from local data:", error);
        return null;
    }
}


export default async function ComponentPage({ params }: { params: { slug: string } }) {
  const component = await getComponentBySlug(params.slug);

  if (!component) {
    notFound();
  }

  // We pass the full component object to the view
  return <ComponentView initialComponent={component} />;
}
    