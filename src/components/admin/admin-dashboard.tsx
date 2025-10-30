'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { UsersTable } from '@/components/admin/users-table';

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'superuser';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

interface AdminDashboardProps {
  users: UserProfile[];
}

export default function AdminDashboard({ users }: AdminDashboardProps) {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Aquí puedes ver y administrar los usuarios de la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable users={users} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
