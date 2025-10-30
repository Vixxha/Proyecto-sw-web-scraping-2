
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import Spinner from '@/components/spinner';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // The empty dependency array ensures this effect runs only once on mount.
    if (!firebaseServices) {
      setFirebaseServices(initializeFirebase());
    }
  }, []); // DO NOT REMOVE THE EMPTY DEPENDENCY ARRAY

  if (!firebaseServices) {
    // Render a loading spinner while Firebase is being initialized on the client.
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // Once initialized, provide the services to the rest of the application.
  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
