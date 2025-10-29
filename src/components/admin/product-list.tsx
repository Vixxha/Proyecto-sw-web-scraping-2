
'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import type { Component as Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Spinner from '../spinner';
import ProductForm, { type ProductFormData } from './product-form';
import ProductActions from './product-actions';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError, errorEmitter } from '@/firebase';
import Image from 'next/image';

// We reuse the Component type but alias it as Product for semantic clarity
type ProductWithId = Product & { id: string };

export default function ProductList() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithId | null>(null);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleFormSubmit = async (formData: ProductFormData) => {
    if (!firestore) return;

    try {
      if (editingProduct) {
        // Update existing product
        const productRef = doc(firestore, 'products', editingProduct.id);
        const productUpdate = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
        };
        await updateDoc(productRef, productUpdate).catch(error => {
            const contextualError = new FirestorePermissionError({
                path: productRef.path,
                operation: 'update',
                requestResourceData: productUpdate
            });
            errorEmitter.emit('permission-error', contextualError);
            throw contextualError;
        });

        toast({ title: 'Producto actualizado', description: `${formData.name} ha sido actualizado.` });
      } else {
        // Create new product
        const collectionRef = collection(firestore, 'products');
        const newProduct = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            createdAt: serverTimestamp(),
            // Mocking some required fields from Component type
            slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            prices: [{ storeId: 'store-1', price: Number(formData.price), url: '#' }], // Mock price
            priceHistory: [],
            imageUrl: 'https://picsum.photos/seed/default/600/600',
            imageHint: 'product',
        };
        await addDoc(collectionRef, newProduct).catch(error => {
            const contextualError = new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: newProduct
            });
            errorEmitter.emit('permission-error', contextualError);
            throw contextualError;
        });

        toast({ title: 'Producto creado', description: `${formData.name} ha sido añadido al catálogo.` });
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error de Permiso',
        description: 'No tienes permiso para realizar esta acción.',
       });
    }
  };

  const handleEdit = (product: ProductWithId) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', productId);
    try {
      await deleteDoc(productRef).catch(error => {
        const contextualError = new FirestorePermissionError({ path: productRef.path, operation: 'delete' });
        errorEmitter.emit('permission-error', contextualError);
        throw contextualError;
      });
      toast({ title: 'Producto eliminado', description: 'El producto ha sido eliminado del catálogo.' });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error de Permiso',
        description: 'No tienes permiso para eliminar este producto.',
       });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Catálogo de Productos</CardTitle>
              <CardDescription>Lista de todos los productos disponibles en la tienda.</CardDescription>
            </div>
            <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Spinner className="h-12 w-12" /></div>
          ) : products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[80px] sm:table-cell">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                    <TableCell className="text-right">${Number(product.price).toLocaleString('es-CL')}</TableCell>
                    <TableCell className="text-right">
                      <ProductActions
                        onEdit={() => handleEdit(product)}
                        onDelete={() => handleDelete(product.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No se encontraron productos. Comienza añadiendo uno.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <ProductForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />
    </>
  );
}
