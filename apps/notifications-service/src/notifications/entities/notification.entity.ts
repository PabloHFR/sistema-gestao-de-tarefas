import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

// Tipos de notificação
export enum NotificationType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  COMMENT_CREATED = 'COMMENT_CREATED',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID do usuário que receberá a notificação
  @Column('uuid')
  @Index() // Índice para buscar por usuário
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  // Título da notificação (ex: "Nova tarefa atribuída")
  @Column()
  title: string;

  // Mensagem descritiva (ex: "João te atribuiu à tarefa 'Implementar JWT'")
  @Column('text')
  message: string;

  // Dados adicionais em JSON (ex: { taskId, taskTitle, authorName })
  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
