
import { Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <header className="mb-12 text-center">
         <Shield className="h-16 w-16 mx-auto text-primary" />
        <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Términos y Servicios
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Última actualización: 24 de Julio de 2024
        </p>
      </header>

      <div className="prose prose-lg dark:prose-invert mx-auto">
        <h2 className="text-2xl font-bold">1. Aceptación de los Términos</h2>
        <p>
          Al acceder y utilizar ComponentCompares (el "Sitio"), usted acepta estar sujeto a estos Términos y Servicios ("Términos"). Si no está de acuerdo con alguna parte de los términos, no podrá utilizar el servicio.
        </p>

        <h2 className="text-2xl font-bold mt-8">2. Descripción del Servicio</h2>
        <p>
          ComponentCompares proporciona una plataforma para comparar precios de componentes de PC, construir configuraciones personalizadas y utilizar un asistente de IA para obtener recomendaciones. Los precios y la disponibilidad de los productos son proporcionados por terceros y no podemos garantizar su exactitud.
        </p>

        <h2 className="text-2xl font-bold mt-8">3. Cuentas de Usuario</h2>
        <p>
          Para acceder a ciertas funciones, como guardar configuraciones, debe crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña y de todas las actividades que ocurran bajo su cuenta.
        </p>

        <h2 className="text-2xl font-bold mt-8">4. Contenido Generado por el Usuario</h2>
        <p>
          Usted es el único responsable del contenido que crea y guarda, como las configuraciones de PC. Al utilizar el servicio, nos otorga una licencia para usar, mostrar y distribuir dicho contenido únicamente con el fin de operar y proporcionar los servicios del Sitio.
        </p>

        <h2 className="text-2xl font-bold mt-8">5. Limitación de Responsabilidad</h2>
        <p>
          El servicio se proporciona "tal cual". No garantizamos que el sitio esté libre de errores o que el acceso sea continuo. En ningún caso ComponentCompares será responsable de daños directos o indirectos que resulten del uso o la incapacidad de usar el servicio.
        </p>
        
        <h2 className="text-2xl font-bold mt-8">6. Cambios en los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Le notificaremos de cualquier cambio publicando los nuevos términos en esta página. Se le aconseja revisar estos Términos periódicamente para cualquier cambio.
        </p>
      </div>
    </div>
  );
}
