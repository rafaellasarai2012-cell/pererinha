'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ---------- CONFIG (vagas / data_limite) ----------
export async function getConfig() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('configuracoes_inscricoes')
    .select('*')
    .limit(1)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateConfig(formData: FormData) {
  const supabase = await createClient()
  const vagasRaw = formData.get('vagas_total') as string
  const dataRaw = formData.get('data_limite_inscricao') as string

  const { data: existing } = await supabase
    .from('configuracoes_inscricoes')
    .select('*')
    .limit(1)
    .single()

  if (!existing) throw new Error('Config not found')

  // Only update fields that were provided (non-empty)
  const updates: Record<string, unknown> = {}
  if (vagasRaw && vagasRaw !== '') updates.vagas_total = Number(vagasRaw)
  if (dataRaw && dataRaw !== '') updates.data_limite_inscricao = dataRaw

  if (Object.keys(updates).length === 0) return { success: true }

  const { error } = await supabase
    .from('configuracoes_inscricoes')
    .update(updates)
    .eq('id', existing.id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin', 'layout')
  revalidatePath('/')
  return { success: true }
}

// ---------- INSCRICOES ----------
export async function getInscricoes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inscricoes')
    .select('*')
    .order('data_inscricao', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getInscricoesCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('inscricoes')
    .select('*', { count: 'exact', head: true })

  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function updateInscricaoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('inscricoes')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/inscricoes')
  return { success: true }
}

export async function deleteInscricao(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('inscricoes').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/inscricoes')
  revalidatePath('/admin')
  return { success: true }
}

// ---------- CATEGORIAS ----------
export async function getCategorias() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createCategoria(formData: FormData) {
  const supabase = await createClient()
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string

  const { error } = await supabase
    .from('categorias')
    .insert({ nome, descricao })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias')
  return { success: true }
}

export async function updateCategoria(id: string, formData: FormData) {
  const supabase = await createClient()
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const ativa = formData.get('ativa') === 'true'

  const { error } = await supabase
    .from('categorias')
    .update({ nome, descricao, ativa })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias')
  return { success: true }
}

export async function deleteCategoria(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categorias').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias')
  return { success: true }
}

// ---------- COMUNICADOS ----------
export async function getComunicados() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comunicados')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createComunicado(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const conteudo = formData.get('conteudo') as string

  const { error } = await supabase
    .from('comunicados')
    .insert({ titulo, conteudo })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/comunicados')
  return { success: true }
}

export async function updateComunicado(id: string, formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const conteudo = formData.get('conteudo') as string
  const publicado = formData.get('publicado') === 'true'

  const { error } = await supabase
    .from('comunicados')
    .update({ titulo, conteudo, publicado, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/comunicados')
  return { success: true }
}

export async function deleteComunicado(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('comunicados').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/comunicados')
  return { success: true }
}

// ---------- SITE SETTINGS ----------
export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) throw new Error(error.message)

  const settings: Record<string, string> = {}
  for (const row of data ?? []) {
    settings[row.chave] = row.valor
  }
  return settings
}

export async function updateSiteSetting(chave: string, valor: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({ valor, updated_at: new Date().toISOString() })
    .eq('chave', chave)

  if (error) throw new Error(error.message)
  revalidatePath('/admin', 'layout')
  revalidatePath('/')
  return { success: true }
}

export async function updateMultipleSiteSettings(settings: Record<string, string>) {
  const supabase = await createClient()
  for (const [chave, valor] of Object.entries(settings)) {
    const { error } = await supabase
      .from('site_settings')
      .update({ valor, updated_at: new Date().toISOString() })
      .eq('chave', chave)
    if (error) throw new Error(error.message)
  }
  revalidatePath('/admin', 'layout')
  revalidatePath('/')
  return { success: true }
}

// ---------- DASHBOARD STATS ----------
export async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: totalInscricoes },
    { data: config },
    { data: categorias },
    { data: comunicados },
    { data: recentInscricoes },
  ] = await Promise.all([
    supabase.from('inscricoes').select('*', { count: 'exact', head: true }),
    supabase.from('configuracoes_inscricoes').select('*').limit(1).single(),
    supabase.from('categorias').select('*', { count: 'exact', head: true }),
    supabase.from('comunicados').select('*', { count: 'exact', head: true }),
    supabase
      .from('inscricoes')
      .select('*')
      .order('data_inscricao', { ascending: false })
      .limit(5),
  ])

  const vagasTotal = config?.vagas_total ?? 30
  const inscricoesTotal = totalInscricoes ?? 0
  const vagasDisponiveis = Math.max(0, vagasTotal - inscricoesTotal)
  const dataLimite = config?.data_limite_inscricao ?? null

  return {
    inscricoesTotal,
    vagasTotal,
    vagasDisponiveis,
    dataLimite,
    totalCategorias: categorias?.length ?? 0,
    totalComunicados: comunicados?.length ?? 0,
    recentInscricoes: recentInscricoes ?? [],
  }
}
