
import { Gamepad2 } from 'lucide-react';

export default function GamingPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Gaming y Streaming
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Todo lo que necesitas para llevar tu experiencia de juego y streaming al siguiente nivel.
        </p>
      </section>

      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-bold">Sección en Construcción</h2>
        <p className="mt-2 text-muted-foreground">
          Estamos trabajando para curar la mejor selección de productos para gaming y streaming.
          ¡Vuelve pronto!
        </p>
      </div>
    </div>
  );
}
