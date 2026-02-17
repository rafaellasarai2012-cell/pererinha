import { ChevronDown } from "lucide-react"

interface HeroProps {
  faixaEtaria?: string
  logoUrl?: string
}

export function Hero({ faixaEtaria, logoUrl }: HeroProps) {
  const displayFaixa = faixaEtaria || "Jovens de 4 a 17 anos"
  const displayLogo = logoUrl || "/images/logo.png"
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Logo */}
        <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-primary-foreground/20 shadow-2xl md:h-64 md:w-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayLogo}
            alt="Logo Gremio Recreativo Pereirinha - Crianca sorrindo jogando futebol"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-5xl font-bold uppercase tracking-tight md:text-7xl">
            Projeto Pereirinha
          </h1>
          <div className="mx-auto h-1 w-24 bg-accent" />
          <p className="mt-2 text-lg font-medium tracking-wide text-primary-foreground/70 md:text-xl">
            Gremio Recreativo
          </p>
          <p className="text-balance text-xl font-light text-primary-foreground/80 md:text-2xl">
            {`Futebol para ${displayFaixa.toLowerCase()}`}
          </p>
        </div>

        {/* CTA Button */}
        <a
          href="#inscricao"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-bold uppercase tracking-wide text-accent-foreground transition-all hover:scale-105 hover:brightness-110"
        >
          Inscreva-se Agora
        </a>
      </div>

      {/* Scroll indicator */}
      <a
        href="#info"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-primary-foreground/40 transition-colors hover:text-primary-foreground/70"
        aria-label="Rolar para baixo"
      >
        <ChevronDown className="h-8 w-8" />
      </a>
    </section>
  )
}
