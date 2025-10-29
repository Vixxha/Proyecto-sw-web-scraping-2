import AdminDashboard from '@/components/admin/admin-dashboard';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Panel de Administración
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gestiona usuarios, roles y visualiza la actividad del sistema.
        </p>
      </section>
      <AdminDashboard />
    </div>
  );
}
