'use client'

import {
  createComunicado,
  updateComunicado,
  deleteComunicado,
} from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Megaphone, Eye, EyeOff } from 'lucide-react'

interface Comunicado {
  id: string
  titulo: string
  conteudo: string
  publicado: boolean
  created_at: string
  updated_at: string
}

interface ComunicadosManagerProps {
  comunicados: Comunicado[]
}

export function ComunicadosManager({ comunicados }: ComunicadosManagerProps) {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim() || !conteudo.trim()) return

    startTransition(async () => {
      const formData = new FormData()
      formData.set('titulo', titulo)
      formData.set('conteudo', conteudo)
      await createComunicado(formData)
      setTitulo('')
      setConteudo('')
      setMessage('Comunicado criado com sucesso!')
      setTimeout(() => setMessage(null), 3000)
      router.refresh()
    })
  }

  function handleTogglePublish(com: Comunicado) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('titulo', com.titulo)
      formData.set('conteudo', com.conteudo)
      formData.set('publicado', String(!com.publicado))
      await updateComunicado(com.id, formData)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este comunicado?')) return
    startTransition(async () => {
      await deleteComunicado(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Create form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-accent" />
            Novo Comunicado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                placeholder="Titulo do comunicado"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conteudo">Conteudo</Label>
              <Textarea
                id="conteudo"
                placeholder="Escreva o conteudo do comunicado..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                rows={5}
                required
              />
            </div>
            {message && <p className="text-sm text-accent">{message}</p>}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar Comunicado'}
            </Button>
            <p className="text-xs text-muted-foreground">
              O comunicado sera criado como rascunho. Publique-o para
              torna-lo visivel no site.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-5 w-5 text-accent" />
            Comunicados ({comunicados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comunicados.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum comunicado criado.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {comunicados.map((com) => (
                <div
                  key={com.id}
                  className={`rounded-lg border p-4 transition-opacity ${
                    isPending ? 'opacity-50' : ''
                  } ${!com.publicado ? 'border-dashed' : 'border-border'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {com.titulo}
                        </h3>
                        {com.publicado ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                            <Eye className="h-3 w-3" />
                            Publicado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            <EyeOff className="h-3 w-3" />
                            Rascunho
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                        {com.conteudo}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Criado em{' '}
                        {new Date(com.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`publish-${com.id}`}
                          className="text-xs text-muted-foreground"
                        >
                          {com.publicado ? 'Publicado' : 'Publicar'}
                        </Label>
                        <Switch
                          id={`publish-${com.id}`}
                          checked={com.publicado}
                          onCheckedChange={() => handleTogglePublish(com)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(com.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
