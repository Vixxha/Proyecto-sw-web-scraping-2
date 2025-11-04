import { notFound } from 'next/navigation';
import ComponentView from './component-view';
import { components } from '@/lib/data'; 
import type { Component } from '@/lib/types';

// We remove generateStaticParams to switch to dynamic rendering on-demand.
// This improves build times and server performance by not loading all components at once.

async function getComponentBySlug(slug: string): Promise<(Component & { id: string }) | null> {
    // In a real-world scenario, this would be a database query.
    // e.g., `await db.collection('products').where('slug', '==', slug).get()`
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
  return <ComponentView initialComponent={component} />;
}
