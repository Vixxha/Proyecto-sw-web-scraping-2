'use client';

import StatCard from './stat-card';
import UserList from './user-list';
import { Users, Activity, Package } from 'lucide-react';

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

interface AdminDashboardProps {
  users: UserProfile[];
  products: Product[];
}

// This is now a "dumb" component that just displays the data it's given.
export default function AdminDashboard({ users, products }: AdminDashboardProps) {
  const totalUsers = users.length;
  const superuserCount = users.filter(u => u.role === 'superuser').length;
  const totalProducts = products.length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Usuarios" value={totalUsers} icon={Users} />
        <StatCard title="Superusuarios" value={superuserCount} icon={Users} />
        <StatCard title="Total de Productos" value={totalProducts} icon={Package} />
        <StatCard title="Actividad Reciente" value="0" icon={Activity} description="En las últimas 24h" />
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <UserList users={users} />
      </div>
    </div>
  );
}
