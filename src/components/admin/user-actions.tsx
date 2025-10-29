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

interface UserActionsProps {
  user: {
    id: string;
    role: 'user' | 'superuser';
  };
}

export default function UserActions({ user }: UserActionsProps) {
  
  const handleRoleChange = (newRole: 'user' | 'superuser') => {
    console.log(`Changing user ${user.id} role to ${newRole}`);
    // Logic to update user role will be added here
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
        <DropdownMenuItem>
          <UserCog className="mr-2 h-4 w-4" />
          Suspender Usuario (Próximamente)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
