
'use client';

import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import type { PCBuild, Component } from '@/lib/types';
import Spinner from '@/components/spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { components as allComponents } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Trash2, Calendar, Tag, DollarSign, Cpu, AlertTriangle, HardDrive } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

const componentMap = new Map(allComponents.map(c => [c.slug, c]));

function BuildCard({ build }: { build: PCBuild }) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!build.userId || !build.id) return;
        const buildDocRef = doc(firestore, 'users', build.userId, 'builds', build.id);
        try {
            await deleteDoc(buildDocRef);
            toast({
                title: 'Configuración eliminada',
                description: `La configuración "${build.name}" ha sido eliminada.`,
            })
        } catch (error) {
            console.error("Error deleting build:", error);
            toast({
                variant: 'destructive',
                title: 'Error al eliminar',
                description: 'No se pudo eliminar la configuración.',
            });
        }
    };
    
    const buildComponents: { category: string, component: Component | undefined }[] = Object.entries(build.components || {}).flatMap(([category, slugs]) => 
        (slugs as unknown as string[]).map(slug => ({
            category,
            component: componentMap.get(slug)
        }))
    );

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl">{build.name}</CardTitle>
                        {build.createdAt && (
                             <p className="text-sm text-muted-foreground flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-2"/>
                                Creado el {format(build.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es })}
                            </p>
                        )}
                    </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente tu configuración
                                guardada.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                {buildComponents.map(({ category, component }, index) => component ? (
                    <div key={`${component.id}-${index}`} className="flex items-center gap-3 text-sm">
                        <Image src={component.imageUrl} alt={component.name} width={40} height={40} className="rounded-md object-cover"/>
                        <div className="flex-grow">
                             <p className="font-semibold leading-tight">{component.name}</p>
                             <p className="text-xs text-muted-foreground">{category}</p>
                        </div>
                        <p className="font-medium">${component.price.toLocaleString('es-CL')}</p>
                    </div>
                ) : null)}
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 flex justify-between items-center mt-4">
                 <p className="text-sm font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4"/>Total:</p>
                 <p className="text-xl font-bold text-primary">${build.totalPrice.toLocaleString('es-CL')}</p>
            </CardFooter>
        </Card>
    )
}

export default function MyBuildsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const buildsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'builds'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: builds, isLoading: areBuildsLoading, error } = useCollection<PCBuild>(buildsQuery);
  
  if (isUserLoading || (user && areBuildsLoading)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner className="h-12 w-12 mx-auto" />
        <p className="mt-4 text-muted-foreground">Cargando tus configuraciones...</p>
      </div>
    );
  }

  if (!user) {
    return (
         <div className="container mx-auto px-4 py-8 text-center">
            <HardDrive className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="mt-4 text-2xl font-bold">Inicia sesión para ver tus configuraciones</h1>
            <p className="mt-2 text-muted-foreground">Aquí aparecerán todas las PCs que guardes.</p>
            <Button asChild className="mt-6">
                <Link href="/login">Iniciar Sesión</Link>
            </Button>
         </div>
    );
  }

  if (error) {
    return (
         <div className="container mx-auto px-4 py-8 text-center text-destructive">
            <AlertTriangle className="h-12 w-12 mx-auto" />
            <h1 className="mt-4 text-2xl font-bold">Ocurrió un error</h1>
            <p className="mt-2">{error.message}</p>
         </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Mis Configuraciones Guardadas
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Aquí puedes ver, editar y comparar todas las computadoras que has armado.
        </p>
      </section>

      {builds && builds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {builds.map(build => (
                <BuildCard key={build.id} build={build} />
            ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Cpu className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="mt-6 text-2xl font-bold">Aún no tienes configuraciones</h2>
            <p className="mt-2 text-muted-foreground">
                Ve al constructor de PCs para armar y guardar tu primera configuración.
            </p>
            <Button asChild className="mt-6">
                <Link href="/build">Ir al Constructor</Link>
            </Button>
         </div>
      )}
    </div>
  );
}
