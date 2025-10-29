'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import UserActions from './user-actions';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'superuser';
  status: 'active' | 'suspended';
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  }
}

interface UserListProps {
  users: UserProfile[];
}

export default function UserList({ users }: UserListProps) {
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatCreationDate = (createdAt: UserProfile['createdAt']) => {
    if (!createdAt) return 'Fecha desconocida';
    const date = new Date(createdAt.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
        <CardDescription>
          Una lista de todos los usuarios de la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Rol</TableHead>
              <TableHead className="hidden md:table-cell">Fecha de creación</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="hidden sm:table-cell">
                  <Avatar className="h-9 w-9">
                    {/* Assuming no photoURL for now */}
                    <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'}>
                    {user.status === 'active' ? 'Activo' : 'Suspendido'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                   <Badge variant={user.role === 'superuser' ? 'default' : 'outline'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {formatCreationDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
