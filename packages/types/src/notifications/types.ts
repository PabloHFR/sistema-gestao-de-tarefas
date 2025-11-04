export enum NotificationType {
  TASK_CREATED = "TASK_CREATED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED",
  COMMENT_CREATED = "COMMENT_CREATED",
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: {
    taskId?: string;
    taskTitle?: string;
    authorId?: string;
    authorName?: string;
    [key: string]: any;
  };
  createdAt: string;
}

export interface NotificationHistoryResponse {
  notifications: Notification[];
  count: number;
}
