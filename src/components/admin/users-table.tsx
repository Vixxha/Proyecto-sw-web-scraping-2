'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserActions } from './user-actions';

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

interface UsersTableProps {
  users: UserProfile[];
}

export function UsersTable({ users }: UsersTableProps) {
  const formatDate = (timestamp: { seconds: number; nanoseconds: number } | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('es-CL');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Fecha de Registro</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell>
              <Badge variant={user.role === 'superuser' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <UserActions userId={user.id} currentRole={user.role} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
