import { notFound } from 'next/navigation';
import ComponentView from './component-view';
import { components } from '@/lib/data'; 
import type { Component } from '@/lib/types';

// We can generate static paths from the local data
export async function generateStaticParams() {
  return components.map((component) => ({
    slug: component.slug,
  }));
}

async function getComponentBySlug(slug: string): Promise<(Component & { id: string }) | null> {
    // Find the component in the local data array
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
  return <ComponentView initialComponent={component} />;
}
