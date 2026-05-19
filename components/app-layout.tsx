"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Droplets, Users, Package, Wallet, BarChart3, Menu, Settings, Truck, MoreHorizontal, Factory } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOutAction } from "@/lib/actions/auth"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/repartos", label: "Repartos", icon: Truck },
  { href: "/llenados", label: "Llenados", icon: Droplets },
  { href: "/caja", label: "Caja", icon: Wallet },
  { href: "/mas", label: "Más", icon: MoreHorizontal },
]

const moreItems = [
  { href: "/marcas", label: "Marcas", icon: Factory },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
]

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <div className="relative size-11 shrink-0 md:size-14">
        <Image
          src="/images/logo-aguademesa.png"
          alt="Agua de Mesa"
          fill
          sizes="48px"
          className="object-contain"
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
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ||
            (item.href === "/mas" && moreItems.some((moreItem) => pathname === moreItem.href || pathname.startsWith(`${moreItem.href}/`)))
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
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))
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
        
        <div className="pt-4 border-t border-border mt-4 space-y-1">
          {moreItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
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
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <form action={signOutAction}>
          <Button variant="outline" size="sm" className="w-full">
            Salir
          </Button>
        </form>
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
                {[...navItems, ...moreItems].map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))
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
                <form action={signOutAction}>
                  <Button variant="outline" size="sm" className="w-full">
                    Salir
                  </Button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target as HTMLElement | null
      const anchor = target?.closest("a")
      if (!anchor?.href || anchor.target === "_blank") return

      const nextUrl = new URL(anchor.href)
      if (nextUrl.origin !== window.location.origin) return
      if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) return

      setIsNavigating(true)
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <MobileHeader />
      <main className="md:ml-64 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
      {isNavigating && <NavigationLoader />}
    </div>
  )
}

function NavigationLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 shadow-lg">
        <div className="relative size-16 animate-pulse">
          <Image
            src="/images/logo-aguademesa.png"
            alt="Agua de Mesa"
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[loading-bar_1s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
