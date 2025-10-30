'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Spinner from '@/components/spinner';

interface UserProfile {
  role: 'customer' | 'superuser';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
        <p className="ml-4">Verificando permisos...</p>
      </div>
    );
  }

  if (profileError) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">Error de Permisos</h1>
            <p className="text-muted-foreground mt-2">No se pudo verificar tu rol de usuario. Es posible que no tengas acceso.</p>
            <p className="text-xs text-muted-foreground mt-4">{profileError.message}</p>
        </div>
      )
  }

  if (!user || userProfile?.role !== 'superuser') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Acceso Denegado</h1>
        <p className="text-muted-foreground mt-2">No tienes los permisos necesarios para acceder a esta sección.</p>
      </div>
    );
  }

  return <>{children}</>;
}
