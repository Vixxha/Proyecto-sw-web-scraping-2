'use client';

import StatCard from './stat-card';
import UserList from './user-list';
import { Users, Activity, Package } from 'lucide-react';
import Spinner from '../spinner';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

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

// El componente ahora recibe `users` y `usersLoading` como props
export default function AdminDashboard({ users, usersLoading }: { users: UserProfile[], usersLoading: boolean }) {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);
  const { data: products, isLoading: productsLoading } = useCollection<Product>(productsQuery);

  const totalUsers = users?.length || 0;
  const superuserCount = users?.filter(u => u.role === 'superuser').length || 0;
  const totalProducts = products?.length || 0;
  
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Usuarios" value={totalUsers} icon={Users} />
        <StatCard title="Superusuarios" value={superuserCount} icon={Users} />
        <StatCard title="Total de Productos" value={totalProducts} icon={Package} />
        <StatCard title="Actividad Reciente" value="0" icon={Activity} description="En las últimas 24h" />
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        {usersLoading ? (
            <div className="flex justify-center items-center h-64"><Spinner className="h-12 w-12" /></div>
        ) : (
            <UserList users={users || []} />
        )}
      </div>
    </div>
  );
}
