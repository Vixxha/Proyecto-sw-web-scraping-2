

import { doc, getDoc, getDocs, collection, query, where, limit } from 'firebase/firestore';
import { getSdks } from '@/firebase';
import { notFound } from 'next/navigation';
import ComponentView from './component-view';
import type { Component } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

// This server component's purpose is to ensure the page exists at build time
// or to handle server-side logic if needed.
// The actual data fetching and rendering is delegated to the client component `ComponentView`.
export default function ComponentPage({ params }: { params: { slug: string } }) {
  // We pass the slug to ComponentView, and it will handle fetching the data
  // from Firestore on the client side. This approach is simpler and avoids
  // complex data passing from Server to Client Components, while also
  // allowing real-time updates if the data changes in Firestore.
  return <ComponentView slug={params.slug} />;
}
