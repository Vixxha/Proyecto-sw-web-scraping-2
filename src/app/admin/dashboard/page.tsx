'use client';

import AdminDashboard from '@/components/admin/admin-dashboard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import Spinner from '@/components/spinner';

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'superuser';
  status: 'active' | 'suspended';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  }
}

type Product = {
    id: string;
}

// This page is now responsible for fetching all admin data.
// It will only be rendered if the AdminLayout allows it.
export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // This query will only execute because this page is only rendered for superusers.
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'));
  }, [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);
  const { data: products, isLoading: productsLoading } = useCollection<Product>(productsQuery);
  
  const isLoading = usersLoading || productsLoading;
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Panel de Administración
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gestiona usuarios, roles y visualiza la actividad del sistema.
        </p>
      </section>
      
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <Spinner className="h-12 w-12" />
        </div>
      ) : (
        // Pass the loaded data down to the display component.
        <AdminDashboard users={users || []} products={products || []} />
      )}
    </div>
  );
}
