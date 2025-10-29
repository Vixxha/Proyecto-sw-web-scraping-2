'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, ShieldOff, UserCog } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError, errorEmitter } from '@/firebase';

interface UserActionsProps {
  user: {
    id: string;
    role: 'user' | 'superuser';
  };
}

export default function UserActions({ user }: UserActionsProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleRoleChange = async (newRole: 'user' | 'superuser') => {
    if (!firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Servicio de base de datos no disponible.',
        });
        return;
    }

    const userDocRef = doc(firestore, 'users', user.id);
    const roleUpdate = { role: newRole };

    updateDoc(userDocRef, roleUpdate)
        .then(() => {
            toast({
                title: 'Rol actualizado',
                description: `El usuario ha sido actualizado a ${newRole}.`,
            });
        })
        .catch((error) => {
            const contextualError = new FirestorePermissionError({
                operation: 'update',
                path: userDocRef.path,
                requestResourceData: roleUpdate
            });
            errorEmitter.emit('permission-error', contextualError);
            
            // This toast is for user feedback, as the detailed error is in the dev console
            toast({
                variant: 'destructive',
                title: 'Error de Permiso',
                description: 'No tienes permiso para realizar esta acción.',
            });
        });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === 'user' ? (
          <DropdownMenuItem onClick={() => handleRoleChange('superuser')}>
            <Shield className="mr-2 h-4 w-4" />
            Promover a Superusuario
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleRoleChange('user')}>
            <ShieldOff className="mr-2 h-4 w-4" />
            Degradar a Usuario
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled>
          <UserCog className="mr-2 h-4 w-4" />
          Suspender Usuario (Próximamente)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
