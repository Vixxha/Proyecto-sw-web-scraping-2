
import { components } from '@/lib/data';
import { notFound } from 'next/navigation';
import ComponentView from './component-view';

export default function ComponentPage({ params }: { params: { slug: string } }) {
  const component = components.find(c => c.slug === params.slug);

  if (!component) {
    notFound();
  }

  // We pass the full component object to the view
  return <ComponentView component={component} />;
}

    