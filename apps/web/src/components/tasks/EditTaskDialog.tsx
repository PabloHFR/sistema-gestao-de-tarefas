import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useUpdateTask } from "@/hooks/useTasks";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { updateTaskSchema, type UpdateTaskFormData } from "@/schemas/tasks";
import { TaskPriority, TaskStatus, type Task } from "@monorepo/types";

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
  });

  // Preenche o formulário quando o dialog abre
  useEffect(() => {
    if (open && task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline
          ? format(new Date(task.deadline), "yyyy-MM-dd")
          : undefined,
      });
    }
  }, [open, task, reset]);

  const onSubmit = (data: UpdateTaskFormData) => {
    updateTask(
      { taskId: task.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na tarefa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Título</FieldLabel>
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
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
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
              <FieldLabel htmlFor="deadline">Prazo</FieldLabel>
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
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
