

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Cpu, Dices, Bot, LogOut, HardDrive, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/firebase";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut } from "firebase/auth";
import Spinner from "./spinner";
import { MegaMenu } from "./mega-menu";

const mainNavLinks = [
  { href: "/build", label: "Arma tu PC", icon: Dices },
  { href: "/ai-builder", label: "Asistente IA", icon: Bot },
];

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState('');
  const placeholderText = "Busca un producto...";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setPlaceholder(prev => prev + placeholderText[currentIndex]);
      currentIndex++;
      if (currentIndex >= placeholderText.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/components?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
};


export function Header() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const MainNav = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-4 lg:gap-6", className)}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                    "transition-colors hover:text-foreground/80 text-sm font-medium",
                     pathname.startsWith('/components') ? "text-foreground" : "text-foreground/60"
                )}>Explorar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-screen max-w-6xl p-0" align="center">
                <MegaMenu />
            </DropdownMenuContent>
        </DropdownMenu>

      {mainNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "transition-colors hover:text-foreground/80 text-sm font-medium",
            pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Mobile Nav Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <SheetHeader className="text-left mb-4">
                <Link href="/" className="flex items-center">
                  <Logo className="mr-2 h-6 w-6 text-primary" />
                  <span className="font-bold">ComponentCompares</span>
                </Link>
             </SheetHeader>
            <div className="flex flex-col space-y-3">
                 <Link
                    href="/components"
                    className={cn(
                        "transition-colors hover:text-foreground/80 text-lg flex items-center gap-3 p-2 rounded-md",
                        pathname.startsWith('/components') ? "text-foreground bg-muted" : "text-foreground/60"
                    )}
                 >
                    <Cpu className="h-5 w-5" />
                    Explorar
                 </Link>
                 {mainNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "transition-colors hover:text-foreground/80 text-lg flex items-center gap-3 p-2 rounded-md",
                        pathname.startsWith(link.href) ? "text-foreground bg-muted" : "text-foreground/60"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Desktop Layout */}
        <div className="flex flex-1 items-center justify-between gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-7 w-7 text-primary" />
              <span className="hidden sm:inline-block font-bold text-lg">
                ComponentCompares
              </span>
            </Link>

          <div className="flex-1 flex justify-center">
            <div className="hidden md:block w-full">
              <SearchBar />
            </div>
          </div>

          <nav className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-4">
                <MainNav />
             </div>
             {isUserLoading ? (
              <Spinner />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuario'} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'Usuario'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-builds">
                      <HardDrive className="mr-2 h-4 w-4" />
                      <span>Mis Configuraciones</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
       <div className="md:hidden p-2 border-t">
          <SearchBar />
        </div>
    </header>
  );
}
