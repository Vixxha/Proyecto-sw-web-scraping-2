'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
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
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ComponentForm from '@/components/component-form';
import { useToast } from '@/hooks/use-toast';


export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);

  const componentsCollectionRef = useMemoFirebase(() => collection(firestore, 'components'), [firestore]);
  const { data: components, isLoading: areComponentsLoading } = useCollection<Component>(componentsCollectionRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleOpenForm = (component?: Component) => {
    setEditingComponent(component || null);
    setFormOpen(true);
  }
  
  const handleCloseForm = () => {
    setEditingComponent(null);
    setFormOpen(false);
  }

  const handleFormSubmit = async (componentData: Omit<Component, 'id'>) => {
    if (editingComponent) {
        // Update existing component
        const componentRef = doc(firestore, 'components', editingComponent.id);
        updateDocumentNonBlocking(componentRef, {
            ...componentData,
            updatedAt: serverTimestamp(),
        });
        toast({
            title: 'Componente actualizado',
            description: 'El componente ha sido actualizado correctamente.',
        });
    } else {
        // Add new component
        addDocumentNonBlocking(collection(firestore, 'components'), {
            ...componentData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({
            title: 'Componente añadido',
            description: 'El nuevo componente ha sido guardado correctamente.',
        });
    }
    handleCloseForm();
  };

  const handleDeleteComponent = async (componentId: string) => {
    deleteDocumentNonBlocking(doc(firestore, 'components', componentId));
    toast({
        title: 'Componente eliminado',
        description: 'El componente ha sido eliminado permanentemente.',
    });
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
            <Button onClick={() => handleOpenForm()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Componente
            </Button>
        </div>

      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingComponent ? 'Editar' : 'Añadir Nuevo'} Componente</DialogTitle>
            </DialogHeader>
            <ComponentForm
                initialData={editingComponent}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseForm}
            />
          </DialogContent>
      </Dialog>

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
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
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
                    <TableCell>{component.category}</TableCell>
                    <TableCell>{component.brand}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(component)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro de que quieres eliminar?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente el componente de la base de datos.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteComponent(component.id)}>
                                Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
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
