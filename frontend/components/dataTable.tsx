import React from "react"
import { flexRender } from "@tanstack/react-table"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  type SortingState,
} from "@tanstack/react-table"
import {
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  type UniqueIdentifier,
} from "@dnd-kit/core"

// Tipagem do dado que vem do backend
type Bank = {
  id: number
  nome: string
  valor: number
  // adicione mais campos se necessário
}

export function DataTable() {
  const [data, setData] = React.useState<Bank[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch dos dados com cookies JWT HttpOnly
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await fetch("http://172.27.96.1:8001/api/banks/listagem/", {
          credentials: "include",
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (res.status === 401) {
          const refreshRes = await fetch("http://172.27.96.1:8001/api/token/refresh/cookie/", {
            method: "POST",
            credentials: "include",
          })
          if (!refreshRes.ok) throw new Error("Erro ao renovar token")
          res = await fetch("http://172.27.96.1:8001/api/banks/listagem/", {
            credentials: "include",
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }

        if (!res.ok) throw new Error(`Erro ${res.status}`)
        const data: Bank[] = await res.json()
        setData(data)
        setLoading(false)
      } catch (err) {
        console.error("Erro ao buscar dados:", err)
        setError("Erro ao buscar dados.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data]
  )

  // Defina suas colunas conforme o seu modelo
  const columns = React.useMemo<ColumnDef<Bank>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "nome",
        header: "Nome do Banco",
      },
      {
        accessorKey: "valor",
        header: "Valor",
        cell: (info) => `R$ ${info.getValue()}`,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  if (loading) return <p>Carregando dados...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                </th>
              ))}
              <th>ação</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td>
                <button
                  onClick={() => {
                    const bankId = row.original.id
                    fetch(`http://172.27.96.1:8001/api/banks/deletar/${bankId}/`, {
                      method: "DELETE",
                      credentials: "include",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                      .then((res) => {
                        if (!res.ok) throw new Error(`Erro ${res.status}`)
                        setData((prev) => prev.filter((b) => b.id !== bankId))
                      })
                      .catch(() => {
                        alert("Erro ao deletar banco.")
                      })
                  }}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
