import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Prefere o Google Forms?
        </h2>
        <p className="text-primary-foreground/70">
          Voce tambem pode se inscrever pelo nosso formulario do Google Forms.
        </p>
        <Button
          asChild
          variant="outline"
          className="h-12 gap-2 border-primary-foreground/30 bg-transparent px-8 text-lg font-semibold text-primary-foreground hover:bg-primary-foreground hover:text-primary"
        >
          <a
            href="https://forms.gle/dUPypKrr9FTMQVJ77"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inscrever-se via Formulario
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  )
}
