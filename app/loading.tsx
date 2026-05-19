import Image from "next/image"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-20 animate-pulse">
          <Image
            src="/images/logo-aguademesa.png"
            alt="Agua de Mesa"
            fill
            sizes="80px"
            className="object-contain"
            priority
          />
        </div>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[loading-bar_1s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
