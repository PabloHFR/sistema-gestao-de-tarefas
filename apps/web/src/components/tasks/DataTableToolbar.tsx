import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { TaskPriority, TaskStatus } from "@monorepo/types";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const statusOptions = [
  {
    label: "A Fazer",
    value: TaskStatus.TODO,
  },
  {
    label: "Em Progresso",
    value: TaskStatus.IN_PROGRESS,
  },
  {
    label: "Em Revisão",
    value: TaskStatus.REVIEW,
  },
  {
    label: "Concluído",
    value: TaskStatus.DONE,
  },
];

const priorityOptions = [
  {
    label: "Baixa",
    value: TaskPriority.LOW,
  },
  {
    label: "Média",
    value: TaskPriority.MEDIUM,
  },
  {
    label: "Alta",
    value: TaskPriority.HIGH,
  },
  {
    label: "Urgente",
    value: TaskPriority.URGENT,
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/_authenticated/tasks/" });

  const [searchValue, setSearchValue] = useState(searchParams.search || "");

  // Debounce para o search
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({
        to: ".",
        search: {
          ...searchParams,
          search: searchValue || undefined,
        },
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const isFiltered =
    searchParams.search || searchParams.status || searchParams.priority;

  const handleResetFilters = () => {
    setSearchValue("");
    navigate({
      to: ".",
      search: {
        page: 1,
        size: searchParams.size || 10,
      },
    });
  };

  const handleStatusFilter = (values: string[]) => {
    navigate({
      to: ".",
      search: {
        ...searchParams,
        status: values.length > 0 ? values.join(",") : undefined,
        page: 1,
      },
    });
  };

  const handlePriorityFilter = (values: string[]) => {
    navigate({
      to: ".",
      search: {
        ...searchParams,
        priority: values.length > 0 ? values.join(",") : undefined,
        page: 1,
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar tarefas por título ou descrição..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusOptions}
            selectedValues={searchParams.status?.split(",") || []}
            onFilterChange={handleStatusFilter}
          />
        )}

        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Prioridade"
            options={priorityOptions}
            selectedValues={searchParams.priority?.split(",") || []}
            onFilterChange={handlePriorityFilter}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <CreateTaskDialog />
      </div>
    </div>
  );
}
