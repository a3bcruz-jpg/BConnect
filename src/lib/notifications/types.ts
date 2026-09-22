export type NotificationType =
  | 'incident_created'
  | 'incident_verified'
  | 'incident_assigned'
  | 'incident_status_changed'
  | 'incident_escalated'
  | 'system';

export type NotificationPriority = 'critical' | 'high' | 'normal';

export type BConnectNotification = {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  incident_id?: string;
  read_at?: string | null;
  created_at: string;
};
