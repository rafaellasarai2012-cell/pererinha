"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useRegistrationData } from "@/hooks/use-registration-data"
import { CountdownTimer } from "./countdown-timer"
import { SlotsCounter } from "./slots-counter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"

const registrationSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter no minimo 3 caracteres"),
  email: z.string().email("Email invalido"),
  data_nascimento: z.string().min(1, "Data de nascimento obrigatoria"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  responsavel: z.string().min(3, "Nome do responsavel obrigatorio"),
  telefone: z
    .string()
    .min(10, "Telefone invalido")
    .regex(/^[\d()\s-]+$/, "Telefone invalido"),
  bairro: z.string().min(2, "Bairro obrigatorio"),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface CategoriaDB {
  id: string
  nome: string
  descricao: string | null
  ativa: boolean
}

async function fetchCategorias(): Promise<CategoriaDB[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("ativa", true)
    .order("nome", { ascending: true })

  if (error) return []
  return data ?? []
}

export function RegistrationForm() {
  const { data: categoriasDB } = useSWR("categorias-public", fetchCategorias)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { vagasTotal, vagasDisponiveis, dataLimite, isLoading, mutate } =
    useRegistrationData()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const isExpired = dataLimite
    ? new Date(dataLimite).getTime() < Date.now()
    : false
  const noSlots = vagasDisponiveis === 0
  const isDisabled = isExpired || noSlots

  async function onSubmit(data: RegistrationFormData) {
    setSubmitError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("inscricoes").insert({
        nome_completo: data.nome_completo,
        email: data.email,
        data_nascimento: data.data_nascimento,
        categoria: data.categoria,
        responsavel: data.responsavel,
        telefone: data.telefone,
        bairro: data.bairro,
      })

      if (error) throw error
      mutate()
      setSubmitted(true)
    } catch {
      setSubmitError("Erro ao enviar inscricao. Tente novamente.")
    }
  }

  if (submitted) {
    return (
      <section id="inscricao" className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary-foreground/10 p-10 backdrop-blur-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="font-display text-3xl font-bold uppercase">
              Inscricao Enviada!
            </h2>
            <p className="text-primary-foreground/80">
              Sua inscricao foi recebida com sucesso. Entraremos em contato em
              breve para confirmar.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="inscricao" className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="mb-4 text-center font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Inscricao
        </h2>
        <div className="mx-auto mb-10 h-1 w-16 bg-accent" />

        {/* Counters */}
        <div className="mb-10 flex flex-col gap-6 rounded-2xl bg-primary-foreground/5 p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <CountdownTimer targetDate={dataLimite} />
          <div className="hidden h-12 w-px bg-primary-foreground/10 md:block" />
          <div className="w-full md:w-1/2">
            <SlotsCounter
              available={vagasDisponiveis}
              total={vagasTotal}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-2xl bg-primary-foreground/5 p-6 backdrop-blur-sm md:p-8"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome_completo" className="text-sm font-medium text-primary-foreground/80">
              Nome Completo *
            </Label>
            <Input
              id="nome_completo"
              placeholder="Digite seu nome completo"
              disabled={isDisabled}
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
              {...register("nome_completo")}
            />
            {errors.nome_completo && (
              <p className="text-xs text-destructive">{errors.nome_completo.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-primary-foreground/80">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              disabled={isDisabled}
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="data_nascimento" className="text-sm font-medium text-primary-foreground/80">
                Data de Nascimento *
              </Label>
              <Input
                id="data_nascimento"
                type="date"
                disabled={isDisabled}
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                {...register("data_nascimento")}
              />
              {errors.data_nascimento && (
                <p className="text-xs text-destructive">{errors.data_nascimento.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria" className="text-sm font-medium text-primary-foreground/80">
                Categoria *
              </Label>
              <Select
                disabled={isDisabled}
                onValueChange={(val) => setValue("categoria", val, { shouldValidate: true })}
              >
                <SelectTrigger className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground focus:ring-accent">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {(categoriasDB ?? []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.nome}>
                      {cat.nome}{cat.descricao ? ` - ${cat.descricao}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-xs text-destructive">{errors.categoria.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="responsavel" className="text-sm font-medium text-primary-foreground/80">
              Nome do Responsavel *
            </Label>
            <Input
              id="responsavel"
              placeholder="Nome do responsavel"
              disabled={isDisabled}
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
              {...register("responsavel")}
            />
            {errors.responsavel && (
              <p className="text-xs text-destructive">{errors.responsavel.message}</p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="telefone" className="text-sm font-medium text-primary-foreground/80">
                Telefone *
              </Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                disabled={isDisabled}
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                {...register("telefone")}
              />
              {errors.telefone && (
                <p className="text-xs text-destructive">{errors.telefone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bairro" className="text-sm font-medium text-primary-foreground/80">
                Bairro / Regiao *
              </Label>
              <Input
                id="bairro"
                placeholder="Seu bairro"
                disabled={isDisabled}
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                {...register("bairro")}
              />
              {errors.bairro && (
                <p className="text-xs text-destructive">{errors.bairro.message}</p>
              )}
            </div>
          </div>

          {submitError && (
            <div className="rounded-lg bg-destructive/20 px-4 py-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isDisabled || isSubmitting}
            className="mt-2 h-12 bg-accent text-lg font-bold uppercase tracking-wide text-accent-foreground hover:brightness-110 disabled:opacity-50"
          >
            {isSubmitting
              ? "Enviando..."
              : isDisabled
                ? "Inscricoes Encerradas"
                : "Enviar Inscricao"}
          </Button>
        </form>
      </div>
    </section>
  )
}
