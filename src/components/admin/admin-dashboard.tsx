'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import StatCard from './stat-card';
import UserList from './user-list';
import { Users, Activity } from 'lucide-react';
import Spinner from '../spinner';

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

export default function AdminDashboard() {
  // NOTA: La siguiente línea está comentada para evitar el error de permisos de Firestore.
  // La carga de usuarios se reactivará de forma segura en un paso posterior.
  // const firestore = useFirestore();
  // const usersQuery = useMemoFirebase(() => {
  //   if (!firestore) return null;
  //   return query(collection(firestore, 'users'));
  // }, [firestore]);
  // const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const users: UserProfile[] = [];
  const usersLoading = false; // Se establece en falso para mostrar el estado vacío

  const totalUsers = users?.length || 0;
  const superuserCount = users?.filter(u => u.role === 'superuser').length || 0;
  
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Usuarios" value={totalUsers} icon={Users} />
        <StatCard title="Superusuarios" value={superuserCount} icon={Users} />
        <StatCard title="Actividad Reciente" value="0" icon={Activity} description="En las últimas 24h" />
        <StatCard title="Nuevos Registros" value="0" icon={Users} description="Hoy" />
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
