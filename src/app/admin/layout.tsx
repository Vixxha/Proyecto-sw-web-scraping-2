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
  const isSuperuser = userProfile?.role === 'superuser';
  const canAccess = !isLoading && user && isSuperuser;
  const shouldBlock = !isLoading && (!user || !isSuperuser);

  useEffect(() => {
    if (shouldBlock) {
      router.replace('/');
    }
  }, [shouldBlock, router]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (shouldBlock) {
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

  if (canAccess) {
    return <>{children}</>;
  }

  // Fallback case, should not be reached but prevents rendering nothing.
  return null;
}
