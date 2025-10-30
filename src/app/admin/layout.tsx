'use client';

import React from 'react';
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

  // 1. Get the current user's profile to check their role.
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ role: string }>(userDocRef);

  const isLoading = isUserLoading || isProfileLoading;

  // While checking, show a loader.
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // 2. ONLY if the user is a superuser, render the page content.
  if (user && userProfile?.role === 'superuser') {
    return <>{children}</>;
  }
  
  // 3. Otherwise, show an access denied message. This prevents child pages from even trying to load data.
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
