import { CompatibilityChecker } from "@/components/compatibility-checker"

export default function CompatibilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          AI Compatibility Checker
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Not sure if your parts will work together? Let our AI assistant help you find compatible components and flag potential issues.
        </p>
      </section>

      <CompatibilityChecker />
    </div>
  )
}
