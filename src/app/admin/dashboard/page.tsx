'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import AdminDashboard from '@/components/admin/admin-dashboard';
import Spinner from '@/components/spinner';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const usersCollectionRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  
  const { data: users, isLoading: usersLoading, error: usersError } = useCollection(usersCollectionRef);

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (usersError) {
    return <div className="text-red-500 text-center p-8">Error al cargar usuarios: {usersError.message}</div>;
  }

  return <AdminDashboard users={users || []} />;
}
