'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
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

  // 1. Mostrar el Spinner mientras CUALQUIER dato se esté cargando.
  // Esto previene cualquier renderizado prematuro del contenido o de la página de acceso denegado.
  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // 2. Si, y solo si, la carga ha terminado, verificar los permisos.
  // Si el usuario tiene el rol correcto, mostrar el contenido.
  if (user && userProfile?.role === 'superuser') {
    return <>{children}</>;
  }
  
  // 3. Si la carga ha terminado y el usuario no cumple los requisitos,
  // mostrar la página de Acceso Denegado. Esto actúa como el estado final
  // en lugar de una redirección que puede causar problemas de sincronización.
  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <CardTitle>Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">No tienes permisos para acceder a esta página. Serás redirigido en breve.</p>
        </CardContent>
      </Card>
    </div>
  );
}
