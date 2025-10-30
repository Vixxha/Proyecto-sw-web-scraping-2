'use client';

import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Spinner from '@/components/spinner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ role: string }>(userDocRef);

  // Mover la carga de datos de la colección de usuarios a este layout
  const usersQuery = useMemoFirebase(() => {
    // Solo ejecutar la query si el usuario es superuser
    if (!firestore || !userProfile || userProfile.role !== 'superuser') return null;
    return query(collection(firestore, 'users'));
  }, [firestore, userProfile]);

  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  // El estado de carga ahora considera el perfil y la lista de usuarios
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // Si el usuario es superusuario, renderizamos los hijos, inyectando los datos necesarios
  if (user && userProfile?.role === 'superuser') {
    // Clonamos el elemento hijo (la página) para pasarle los props
    return React.cloneElement(children as React.ReactElement, { users, usersLoading });
  }
  
  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <CardTitle>Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
        </CardContent>
      </Card>
    </div>
  );
}
