import { PCBuilder } from "@/components/pc-builder";

export default function BuildPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Arma tu PC Ideal
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Selecciona componentes de nuestro catálogo para crear la configuración perfecta. Nosotros nos encargamos de verificar la compatibilidad y sumar los costos.
        </p>
      </section>
      <PCBuilder />
    </div>
  )
}
