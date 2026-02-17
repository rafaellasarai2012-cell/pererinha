'use client'

import { updateInscricaoStatus, deleteInscricao } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Trash2, Download } from 'lucide-react'

interface Inscricao {
  id: string
  nome_completo: string
  email: string
  data_nascimento: string
  categoria: string
  responsavel: string
  telefone: string
  bairro: string
  status: string | null
  data_inscricao: string
}

interface InscricoesTableProps {
  inscricoes: Inscricao[]
}

export function InscricoesTable({ inscricoes }: InscricoesTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filtered = inscricoes.filter((i) => {
    const matchesSearch =
      search === '' ||
      i.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.bairro.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || (i.status ?? 'pendente') === statusFilter

    return matchesSearch && matchesStatus
  })

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      await updateInscricaoStatus(id, status)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta inscricao?')) return
    startTransition(async () => {
      await deleteInscricao(id)
      router.refresh()
    })
  }

  function handleExportCSV() {
    const headers = [
      'Nome',
      'Email',
      'Data Nascimento',
      'Categoria',
      'Responsavel',
      'Telefone',
      'Bairro',
      'Status',
      'Data Inscricao',
    ]
    const rows = filtered.map((i) => [
      i.nome_completo,
      i.email,
      i.data_nascimento,
      i.categoria,
      i.responsavel,
      i.telefone,
      i.bairro,
      i.status ?? 'pendente',
      new Date(i.data_inscricao).toLocaleDateString('pt-BR'),
    ])

    const csv =
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join(
        '\n'
      )

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inscricoes_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou bairro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma inscricao encontrada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Responsavel</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inscricao) => (
                    <TableRow key={inscricao.id} className={isPending ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">
                        {inscricao.nome_completo}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {inscricao.email}
                      </TableCell>
                      <TableCell>{inscricao.categoria}</TableCell>
                      <TableCell>{inscricao.responsavel}</TableCell>
                      <TableCell>{inscricao.telefone}</TableCell>
                      <TableCell>{inscricao.bairro}</TableCell>
                      <TableCell>
                        <Select
                          value={inscricao.status ?? 'pendente'}
                          onValueChange={(val) =>
                            handleStatusChange(inscricao.id, val)
                          }
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="confirmada">Confirmada</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(inscricao.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Exibindo {filtered.length} de {inscricoes.length} inscricoes
      </p>
    </div>
  )
}
