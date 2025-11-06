import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask } from "@/hooks/useTasks";
import { Textarea } from "@/components/ui/textarea";
import { createTaskSchema, type CreateTaskFormData } from "@/schemas/tasks";
import { TaskPriority, TaskStatus } from "@monorepo/types";

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createTask, isPending } = useCreateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
    },
  });

  const onSubmit = (data: CreateTaskFormData) => {
    createTask(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          <Plus />
          Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar nova tarefa</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova tarefa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Título *</FieldLabel>
              <Input
                id="title"
                placeholder="Digite o título da tarefa"
                {...register("title")}
                disabled={isPending}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Descrição *</FieldLabel>
              <Textarea
                id="description"
                placeholder="Descreva a tarefa em detalhes"
                rows={4}
                {...register("description")}
                disabled={isPending}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="priority">Prioridade</FieldLabel>
                <Select
                  value={watch("priority")}
                  onValueChange={(value) =>
                    setValue("priority", value as TaskPriority)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>Baixa</SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>Média</SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>Alta</SelectItem>
                    <SelectItem value={TaskPriority.URGENT}>Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select
                  value={watch("status")}
                  onValueChange={(value) =>
                    setValue("status", value as TaskStatus)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.TODO}>A Fazer</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                      Em Progresso
                    </SelectItem>
                    <SelectItem value={TaskStatus.REVIEW}>
                      Em Revisão
                    </SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="deadline">Prazo (opcional)</FieldLabel>
              <Input
                id="deadline"
                type="date"
                {...register("deadline")}
                disabled={isPending}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
