
import { HardDrive } from 'lucide-react';

export default function ComputacionPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Computación
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Encuentra notebooks, monitores, impresoras y más.
        </p>
      </section>

      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <HardDrive className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-bold">Sección en Construcción</h2>
        <p className="mt-2 text-muted-foreground">
          Estamos trabajando para traer los mejores productos de computación a nuestro catálogo.
          ¡Vuelve pronto!
        </p>
      </div>
    </div>
  );
}
