'use client';

import React from 'react';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Spinner from '@/components/spinner';

// Componente interno que solo se renderiza si el usuario es superusuario
function SuperuserContent({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();

  // Esta query solo se ejecuta porque este componente solo se monta si el usuario es superuser
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'));
  }, [firestore]);

  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  if (usersLoading) {
    return (
       <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    )
  }

  // Clonamos el elemento hijo (la página) para inyectarle los datos de los usuarios
  return React.cloneElement(children as React.ReactElement, { users, usersLoading: false });
}


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

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // Si el usuario es superusuario, renderizamos el contenedor de contenido de superusuario
  if (user && userProfile?.role === 'superuser') {
    return <SuperuserContent>{children}</SuperuserContent>;
  }
  
  // Si no, mostramos el mensaje de acceso denegado
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
