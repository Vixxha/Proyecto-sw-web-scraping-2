import { Logo } from './logo';
import Link from 'next/link';
import { Instagram } from 'lucide-react';


export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row">
        <div className="flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-bold">ComponentCompares</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
           <Link href="/terms" className="hover:text-primary transition-colors">
              Términos y Servicios
            </Link>
          <p className="hidden sm:block">|</p>
          <p>&copy; {new Date().getFullYear()} ComponentCompares.</p>
        </div>
        <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/chopino._" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
            </a>
        </div>
      </div>
    </footer>
  );
}
