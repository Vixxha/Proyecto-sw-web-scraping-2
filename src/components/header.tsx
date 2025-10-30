
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Cpu, Dices, Bot, LogOut, HardDrive, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/firebase";

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

const mainNavLinks = [
  { href: "/components", label: "Explorar", icon: Cpu },
  { href: "/build", label: "Arma tu PC", icon: Dices },
  { href: "/ai-builder", label: "Asistente IA", icon: Bot },
];

const categoryNavLinks = [
    {
      name: 'Gaming y Streaming',
      sub: [
        { name: 'PC Gamer', href: '/gaming-y-streaming' },
        { name: 'Notebooks Gamer', href: '/gaming-y-streaming' },
        { name: 'Monitores Gamer', href: '/gaming-y-streaming' },
        { name: 'Sillas Gamer', href: '/gaming-y-streaming' }
      ]
    },
    {
      name: 'Computación',
      sub: [
        { name: 'Notebooks', href: '/computacion' },
        { name: 'Monitores', href: '/computacion' },
        { name: 'Impresoras', href: '/computacion' },
        { name: 'Teclados', href: '/computacion' },
        { name: 'Mouse', href: '/computacion' }
      ]
    },
    {
      name: 'Componentes',
      sub: [
        { name: 'Procesadores (CPU)', href: '/components?category=CPU' },
        { name: 'Tarjetas de Video (GPU)', href: '/components?category=GPU' },
        { name: 'Placas Madre', href: '/components?category=Motherboard' },
        { name: 'Memoria RAM', href: '/components?category=RAM' },
        { name: 'Almacenamiento', href: '/components?category=Storage' }
      ]
    },
    {
      name: 'Conectividad y Redes',
      sub: [
        { name: 'Routers', href: '/conectividad-y-redes' },
        { name: 'Tarjetas de Red', href: '/conectividad-y-redes' },
        { name: 'Access Points', href: '/conectividad-y-redes' }
      ]
    },
];


export function Header() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const MainNav = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-4 lg:gap-6", className)}>
      {mainNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center gap-2",
            pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );

   const CategoryNav = () => (
    <div className="border-t hidden md:block">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center justify-center space-x-6 w-full">
          {categoryNavLinks.map((cat) => (
            <DropdownMenu key={cat.name}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary data-[state=open]:text-primary group">
                  {cat.name}
                  <ChevronDown className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {cat.sub.map((subCat) => (
                  <DropdownMenuItem key={subCat.name} asChild>
                    <Link href={subCat.href}>{subCat.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
      </div>
    </div>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              ComponentCompares
            </span>
          </Link>
          <MainNav />
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <SheetHeader className="text-left">
                <SheetTitle className="sr-only">Navegación Principal</SheetTitle>
                <Link
                  href="/"
                  className="flex items-center"
                >
                  <Logo className="mr-2 h-6 w-6 text-primary" />
                  <span className="font-bold">ComponentCompares</span>
                </Link>
             </SheetHeader>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                     {mainNavLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "transition-colors hover:text-foreground/80 text-lg flex items-center gap-3",
                            pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
                          )}
                        >
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      ))}
                </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <nav className="flex items-center gap-2">
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
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
      <CategoryNav />
    </header>
  );
}
