import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryAction } from '@monorepo/types';
import { Task } from './tasks.entity';

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: HistoryAction,
  })
  action: HistoryAction;

  // ID do usuário que fez a alteração
  @Column('uuid')
  userId: string;

  // Username do usuário que fez a altereção (Desnormalizado)
  @Column()
  username: string;

  // Campo que foi alterado (ex: "status", "priority", "assignedTo")
  @Column({ nullable: true })
  field: string;

  // Valor antigo
  @Column('text', { nullable: true })
  oldValue: string;

  // Valor novo
  @Column('text', { nullable: true })
  newValue: string;

  // Relacionamento com Task
  @ManyToOne(() => Task, (task) => task.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column('uuid')
  taskId: string;

  @CreateDateColumn()
  createdAt: Date;
}
