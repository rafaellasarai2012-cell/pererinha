'use client'

import { updateMultipleSiteSettings } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Clock, MapPin, ImageIcon, Save, CheckCircle2 } from 'lucide-react'

interface ConfiguracoesFormProps {
  settings: Record<string, string>
}

export function ConfiguracoesForm({ settings }: ConfiguracoesFormProps) {
  const [faixaEtaria, setFaixaEtaria] = useState(settings.faixa_etaria ?? '')
  const [horarios, setHorarios] = useState(settings.horarios ?? '')
  const [endereco, setEndereco] = useState(settings.endereco ?? '')
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      await updateMultipleSiteSettings({
        faixa_etaria: faixaEtaria,
        horarios: horarios,
        endereco: endereco,
        logo_url: logoUrl,
      })
      setMessage({ type: 'success', text: 'Configuracoes salvas com sucesso!' })
      router.refresh()
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar configuracoes.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Faixa Etaria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-accent" />
              Faixa Etaria
            </CardTitle>
            <CardDescription>
              Texto exibido no Hero e na secao Informacoes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="faixa_etaria">Descricao da faixa etaria</Label>
              <Input
                id="faixa_etaria"
                value={faixaEtaria}
                onChange={(e) => setFaixaEtaria(e.target.value)}
                placeholder="Ex: Jovens de 4 a 17 anos"
              />
              <p className="text-xs text-muted-foreground">
                Aparece como &quot;Futebol para [faixa etaria]&quot; no Hero.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-accent" />
              Horarios
            </CardTitle>
            <CardDescription>
              Horarios de treino exibidos na secao Informacoes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="horarios">Descricao dos horarios</Label>
              <Textarea
                id="horarios"
                value={horarios}
                onChange={(e) => setHorarios(e.target.value)}
                placeholder="Ex: Ter, Qua, Qui: 8h-10h e 14h-16h | Sab: 7h-13h"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Use | para separar dias diferentes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Endereco */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-accent" />
              Endereco
            </CardTitle>
            <CardDescription>
              Endereco do local de treino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endereco">Endereco completo</Label>
              <Textarea
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Rua Joao Jose da Silva, 590 - Vila Caraguata, SP"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo URL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5 text-accent" />
              Logo
            </CardTitle>
            <CardDescription>
              URL da imagem do logo exibida no Hero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="logo_url">URL do Logo</Label>
              <Input
                id="logo_url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/images/logo.png"
              />
              {logoUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt="Preview do logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Save className="h-4 w-4 animate-pulse" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Todas as Configuracoes
            </>
          )}
        </Button>

        {message && (
          <div
            className={`flex items-center gap-2 text-sm ${
              message.type === 'success' ? 'text-accent' : 'text-destructive'
            }`}
          >
            {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
            {message.text}
          </div>
        )}
      </div>
    </form>
  )
}
