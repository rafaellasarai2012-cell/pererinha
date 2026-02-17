'use client'

import { createClient } from '@/lib/supabase/client'
import useSWR from 'swr'
import { Megaphone } from 'lucide-react'

interface Comunicado {
  id: string
  titulo: string
  conteudo: string
  publicado: boolean
  created_at: string
}

async function fetchComunicados(): Promise<Comunicado[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comunicados')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) return []
  return data ?? []
}

export function ComunicadosSection() {
  const { data: comunicados, isLoading } = useSWR(
    'comunicados-public',
    fetchComunicados
  )

  if (isLoading) {
    return (
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-center font-display text-3xl font-bold uppercase tracking-tight text-secondary-foreground md:text-4xl">
            Comunicados
          </h2>
          <div className="mx-auto mb-12 h-1 w-16 bg-accent" />
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl bg-card p-6"
              >
                <div className="h-5 w-48 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!comunicados || comunicados.length === 0) {
    return null
  }

  return (
    <section className="bg-secondary py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-4 text-center font-display text-3xl font-bold uppercase tracking-tight text-secondary-foreground md:text-4xl">
          Comunicados
        </h2>
        <div className="mx-auto mb-12 h-1 w-16 bg-accent" />

        <div className="flex flex-col gap-4">
          {comunicados.map((com) => (
            <div
              key={com.id}
              className="rounded-xl bg-card p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Megaphone className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-card-foreground">
                    {com.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {com.conteudo}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {new Date(com.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
