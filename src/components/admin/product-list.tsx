
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

  const { data: products, isLoading, error } = useCollection<ProductWithId>(productsQuery);

  const handleFormSubmit = (formData: ProductFormData) => {
    if (!firestore) return;

    const operation = editingProduct ? 'update' : 'create';
    const imageUrl = formData.imageUrl || 'https://picsum.photos/seed/default/600/600';
    const price = Number(formData.price) || 0;
    const stock = Number(formData.stock) || 0;

    const promise = editingProduct
      ? (() => {
          const productRef = doc(firestore, 'products', editingProduct.id);
          const productUpdate = { ...formData, imageUrl, price, stock };
          return updateDoc(productRef, productUpdate)
            .catch(err => {
              const contextualError = new FirestorePermissionError({
                path: productRef.path,
                operation: 'update',
                requestResourceData: productUpdate
              });
              errorEmitter.emit('permission-error', contextualError);
              throw contextualError;
            });
        })()
      : (() => {
          const collectionRef = collection(firestore, 'products');
          const newProduct = {
            ...formData,
            price,
            stock,
            createdAt: serverTimestamp(),
            slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            prices: [{ storeId: 'store-1', price: price, url: '#' }],
            priceHistory: [],
            imageUrl,
            imageHint: 'product',
            specs: {}
          };
          return addDoc(collectionRef, newProduct)
            .catch(err => {
              const contextualError = new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: newProduct
              });
              errorEmitter.emit('permission-error', contextualError);
              throw contextualError;
            });
        })();

    promise.then(() => {
      toast({
        title: `Producto ${operation === 'update' ? 'actualizado' : 'creado'}`,
        description: `${formData.name} ha sido ${operation === 'update' ? 'actualizado' : 'añadido'} a Firestore. Refresca para ver los cambios si estás conectado a la DB.`
      });
      setIsFormOpen(false);
      setEditingProduct(null);
    }).catch(err => {
      // The detailed error is handled by the global error listener
    });
  };

  const handleEdit = (product: ProductWithId) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (productId: string, productName: string) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', productId);

    deleteDoc(productRef)
      .then(() => {
        toast({
          title: 'Producto eliminado (de Firestore)',
          description: `${productName} ha sido eliminado de la base de datos.`
        });
      })
      .catch(err => {
        const contextualError = new FirestorePermissionError({ path: productRef.path, operation: 'delete' });
        errorEmitter.emit('permission-error', contextualError);
        // The detailed error is handled by the global error listener
      });
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
          ) : error ? (
             <div className="text-center py-10 text-red-600">
                <p className="font-bold">Error de permisos de lectura</p>
                <p className="text-sm text-muted-foreground">No tienes permiso para listar los productos de la base de datos.</p>
            </div>
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
                        src={product.imageUrl || 'https://picsum.photos/seed/placeholder/64/64'}
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
                        onDelete={() => handleDelete(product.id, product.name)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="font-bold text-muted-foreground">Aún no hay productos en el catálogo.</p>
               <p className="text-sm text-muted-foreground mt-2">Puedes añadir nuevos productos usando el botón de arriba.</p>
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
