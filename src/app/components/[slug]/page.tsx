
import { notFound } from 'next/navigation';
import ComponentView from './component-view';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getSdks } from '@/firebase'; // Using a server-side way to get firestore
import type { Component } from '@/lib/types';


// This function can be used to generate static paths at build time
export async function generateStaticParams() {
  // For now, we return an empty array, as we are fetching dynamically.
  // In a production app, you might fetch all slugs from Firestore here.
  return [];
}

async function getComponentBySlug(slug: string): Promise<(Component & { id: string }) | null> {
    try {
        // We cannot use hooks on the server, so we initialize a server-side instance
        const { firestore } = getSdks(); 
        const productsRef = collection(firestore, 'products');
        const q = query(productsRef, where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...(doc.data() as Component) };

    } catch (error) {
        console.error("Error fetching component by slug:", error);
        // In case of error (e.g., permissions), return null
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
