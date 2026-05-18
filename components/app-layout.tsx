"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Truck, Users, Package, Wallet, BarChart3, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/repartos", label: "Repartos", icon: Truck },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/caja", label: "Caja", icon: Wallet },
]

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-border/60 md:size-12">
        <Image
          src="/images/logo-aguademesa.png"
          alt="Agua de Mesa"
          fill
          sizes="48px"
          className="object-contain p-1"
          priority
        />
      </div>
      <div className={cn("min-w-0", compact && "hidden min-[360px]:block")}>
        <p className="truncate text-base font-bold leading-tight text-foreground md:text-lg">
          Agua de Mesa
        </p>
        <p className="truncate text-xs text-muted-foreground">
          Sistema de Gestión
        </p>
      </div>
    </Link>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function DesktopSidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border fixed left-0 top-0">
      <div className="p-6 border-b border-border">
        <BrandLogo />
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary-foreground bg-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
        
        <div className="pt-4 border-t border-border mt-4">
          <Link
            href="/reportes"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === "/reportes"
                ? "text-primary-foreground bg-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Reportes</span>
          </Link>
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>18/05/2026</p>
          <p className="mt-1">Versión Demo</p>
        </div>
      </div>
    </aside>
  )
}

export function MobileHeader() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border md:hidden">
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <BrandLogo compact />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="py-4">
              <h2 className="text-lg font-semibold mb-4">Menú</h2>
              <nav className="space-y-2">
                {[...navItems, { href: "/reportes", label: "Reportes", icon: BarChart3 }].map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive 
                          ? "text-primary-foreground bg-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">18/05/2026</p>
                <p className="text-xs text-muted-foreground mt-1">Versión Demo</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <MobileHeader />
      <main className="md:ml-64 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
