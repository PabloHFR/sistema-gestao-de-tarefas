import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TaskPriority, TaskStatus } from "@monorepo/types";
import type { Task } from "@monorepo/types";
import { DataTableRowActions } from "./DataTableRowActions";

// Configurações de badge para status
const statusConfig = {
  [TaskStatus.TODO]: { label: "A Fazer", variant: "secondary" as const },
  [TaskStatus.IN_PROGRESS]: {
    label: "Em Progresso",
    variant: "default" as const,
  },
  [TaskStatus.REVIEW]: { label: "Em Revisão", variant: "outline" as const },
  [TaskStatus.DONE]: { label: "Concluído", variant: "success" as const },
};

// Configurações de badge para prioridade
const priorityConfig = {
  [TaskPriority.LOW]: { label: "Baixa", variant: "secondary" as const },
  [TaskPriority.MEDIUM]: { label: "Média", variant: "default" as const },
  [TaskPriority.HIGH]: { label: "Alta", variant: "warning" as const },
  [TaskPriority.URGENT]: { label: "Urgente", variant: "destructive" as const },
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-4">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus;
      const config = statusConfig[status];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority;
      const config = priorityConfig[priority];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prazo" />
    ),
    cell: ({ row }) => {
      const deadline = row.getValue("deadline") as string | null;

      if (!deadline) {
        return <span className="text-muted-foreground">Sem prazo</span>;
      }

      return (
        <span className="text-sm">
          {format(new Date(deadline), "dd/MM/yyyy", { locale: ptBR })}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;

      return (
        <span className="text-sm text-muted-foreground">
          {format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
