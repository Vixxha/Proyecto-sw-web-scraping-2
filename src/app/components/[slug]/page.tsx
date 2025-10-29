import { notFound } from 'next/navigation';
import ComponentView from './component-view';
import { components } from '@/lib/data'; 
import type { Component } from '@/lib/types';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getSdks } from '@/firebase';


export async function generateStaticParams() {
  // Since data is now dynamic, we can't statically generate all paths.
  // We can generate a few popular ones, or none at all.
  // For this example, we won't pre-render any paths at build time.
  // Next.js will render them on-demand.
  return [];
}

async function getComponentBySlug(slug: string): Promise<(Component & { id: string }) | null> {
    try {
        const { firestore } = getSdks();
        const productsRef = collection(firestore, 'products');
        const q = query(productsRef, where('slug', '==', slug), limit(1));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn(`No component found with slug: ${slug}`);
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Component & { id: string };

    } catch (error) {
        console.error("Error fetching component by slug from Firestore:", error);
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
