import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTasksTables1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tabela tasks
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'deadline',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
            default: "'MEDIUM'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
            default: "'TODO'",
          },
          {
            name: 'createdBy',
            type: 'uuid',
          },
          {
            name: 'assignedTo',
            type: 'text',
            default: "''",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Tabela comments
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'authorId',
            type: 'uuid',
          },
          {
            name: 'authorName',
            type: 'varchar',
          },
          {
            name: 'taskId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Tabela task_history
    await queryRunner.createTable(
      new Table({
        name: 'task_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'action',
            type: 'enum',
            enum: [
              'CREATED',
              'UPDATED',
              'STATUS_CHANGED',
              'ASSIGNED',
              'UNASSIGNED',
              'COMMENTED',
            ],
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'field',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'oldValue',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'newValue',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'taskId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Foreign Keys
    // Comments -> Tasks
    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        columnNames: ['taskId'],
        referencedTableName: 'tasks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // TaskHistory -> Tasks
    await queryRunner.createForeignKey(
      'task_history',
      new TableForeignKey({
        columnNames: ['taskId'],
        referencedTableName: 'tasks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropa as foreign keys primeiro
    const commentsTable = await queryRunner.getTable('comments');
    const commentsFk = commentsTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('taskId') !== -1,
    );
    if (commentsFk) {
      await queryRunner.dropForeignKey('comments', commentsFk);
    }

    const historyTable = await queryRunner.getTable('task_history');
    const historyFk = historyTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('taskId') !== -1,
    );
    if (historyFk) {
      await queryRunner.dropForeignKey('task_history', historyFk);
    }

    // Dropa as tabelas
    await queryRunner.dropTable('task_history');
    await queryRunner.dropTable('comments');
    await queryRunner.dropTable('tasks');
  }
}
