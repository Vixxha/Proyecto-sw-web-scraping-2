'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Component } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ComponentForm from '@/components/component-form';
import { useToast } from '@/hooks/use-toast';


export default function AdminDashboardPage() {
  const { user, isUserLoading: isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  const componentsCollectionRef = useMemoFirebase(() => collection(firestore, 'components'), [firestore]);
  const { data: components, isLoading: areComponentsLoading } = useCollection<Omit<Component, 'id'>>(componentsCollectionRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const handleAddComponent = async (componentData: Omit<Component, 'id'>) => {
    try {
      await addDoc(collection(firestore, 'components'), componentData);
      toast({
        title: 'Componente añadido',
        description: 'El nuevo componente ha sido guardado correctamente.',
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding component: ', error);
      toast({
        variant: 'destructive',
        title: 'Error al añadir',
        description: 'No se pudo guardar el componente.',
      });
    }
  };


  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                   <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                 <p className="text-muted-foreground">Gestiona el catálogo de componentes de la tienda.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Componente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Añadir Nuevo Componente</DialogTitle>
                </DialogHeader>
                <ComponentForm onSubmit={handleAddComponent} />
              </DialogContent>
            </Dialog>
        </div>

      <Card>
        <CardHeader>
            <CardTitle>Componentes</CardTitle>
            <CardDescription>
                {areComponentsLoading ? 'Cargando...' : `Hay ${components?.length || 0} componentes en el sistema.`}
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areComponentsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="text-right space-x-2">
                       <Skeleton className="h-8 w-8 inline-block" />
                       <Skeleton className="h-8 w-8 inline-block" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                components?.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell className="font-medium">{component.name}</TableCell>
                    <TableCell>{component.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{component.category}</Badge>
                    </TableCell>
                    <TableCell>{component.brand}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
              )))}
            </TableBody>
          </Table>
           {!areComponentsLoading && components?.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-xl font-medium text-muted-foreground">No hay componentes</p>
                    <p className="text-muted-foreground mt-2">Añade el primer componente para empezar.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
