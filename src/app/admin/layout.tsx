'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ role: string }>(userDocRef);

  const isLoading = isUserLoading || isProfileLoading;

  useEffect(() => {
    // Solo toma una decisión cuando la carga ha terminado.
    if (!isLoading) {
      if (!user || userProfile?.role !== 'superuser') {
        router.replace('/');
      }
    }
  }, [isLoading, user, userProfile, router]);

  // Muestra el spinner mientras CUALQUIER dato se esté cargando.
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // Si después de cargar, el usuario es un superusuario, muestra el contenido.
  if (user && userProfile?.role === 'superuser') {
    return <>{children}</>;
  }
  
  // Si no, muestra "Acceso Denegado" como fallback antes de que el useEffect redirija.
  // Esto previene que se muestre el contenido de la página por un instante.
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
