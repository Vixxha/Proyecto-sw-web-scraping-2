'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Spinner from '@/components/spinner';

interface UserActionsProps {
  userId: string;
  currentRole: 'customer' | 'superuser';
}

export function UserActions({ userId, currentRole }: UserActionsProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async () => {
    if (selectedRole === currentRole) return;

    setIsLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, { role: selectedRole });
      toast({
        title: 'Rol actualizado',
        description: `El usuario ahora tiene el rol de ${selectedRole}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar el rol',
        description: error.message || 'No se pudo completar la operación.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'customer' | 'superuser')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="superuser">Superuser</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleRoleChange} disabled={isLoading || selectedRole === currentRole}>
        {isLoading ? <Spinner className="h-4 w-4" /> : 'Guardar'}
      </Button>
    </div>
  );
}
