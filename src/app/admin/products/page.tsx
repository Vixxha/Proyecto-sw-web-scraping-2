
import ProductList from '@/components/admin/product-list';

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Gestión de Productos
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Añade, edita y elimina productos del catálogo.
        </p>
      </section>
      <ProductList />
    </div>
  );
}
