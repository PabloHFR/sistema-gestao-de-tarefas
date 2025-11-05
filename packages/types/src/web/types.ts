import type { NotificationHistoryResponse } from "../notifications/types";

export interface LoginRequest {
  identifier: string; // email ou username
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// WEBSOCKET EVENTS
export interface WebSocketEvents {
  // Receber do servidor
  "task:created": (notification: Notification) => void;
  "task:updated": (notification: Notification) => void;
  "comment:new": (notification: Notification) => void;
  "notifications:history": (data: NotificationHistoryResponse) => void;
}
