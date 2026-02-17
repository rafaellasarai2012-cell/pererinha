import { getSiteSettings } from '@/app/admin/actions'
import { ConfiguracoesForm } from './configuracoes-form'

export default async function ConfiguracoesPage() {
  const settings = await getSiteSettings()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Configuracoes do Site
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie as informacoes exibidas na pagina principal: faixa etaria, horarios, endereco e logo.
        </p>
      </div>

      <ConfiguracoesForm settings={settings} />
    </div>
  )
}
