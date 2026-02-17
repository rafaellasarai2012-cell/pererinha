import { Hero } from "@/components/hero"
import { InformationSection } from "@/components/information-section"
import { RegistrationFormWrapper } from "@/components/registration-form-wrapper"
import { Statistics } from "@/components/statistics"
import { ComunicadosSection } from "@/components/comunicados-section"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"

async function getSiteSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from("site_settings").select("*")
  const settings: Record<string, string> = {}
  for (const row of data ?? []) {
    settings[row.chave] = row.valor
  }
  return settings
}

async function getActiveCategorias() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categorias")
    .select("nome")
    .eq("ativa", true)
    .order("nome", { ascending: true })
  return (data ?? []).map((c: { nome: string }) => c.nome).join(", ")
}

export default async function Page() {
  const [settings, categoriasText] = await Promise.all([
    getSiteSettings(),
    getActiveCategorias(),
  ])

  return (
    <main>
      <Hero
        faixaEtaria={settings.faixa_etaria}
        logoUrl={settings.logo_url}
      />
      <InformationSection
        faixaEtaria={settings.faixa_etaria}
        horarios={settings.horarios}
        endereco={settings.endereco}
        categorias={categoriasText}
      />
      <RegistrationFormWrapper />
      <Statistics />
      <ComunicadosSection />
      <CtaSection />
      <SiteFooter logoUrl={settings.logo_url} endereco={settings.endereco} />
    </main>
  )
}
