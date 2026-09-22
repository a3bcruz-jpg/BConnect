import type { IncidentPriority } from '../incidents/priority';
import type { NotificationPriority, NotificationType } from './types';

export type IncidentNotificationEvent = {
  type: NotificationType;
  incidentId: string;
  title: string;
  message: string;
  priority: NotificationPriority;
};

export function notificationForIncidentCreated(incidentId: string, priority: IncidentPriority): IncidentNotificationEvent {
  const notificationPriority: NotificationPriority = priority === 'critical' ? 'critical' : priority === 'high' ? 'high' : 'normal';
  return {
    type: 'incident_created',
    incidentId,
    title: 'New incident report',
    message: 'A new incident requires review.',
    priority: notificationPriority,
  };
}

export function notificationForAssignment(incidentId: string): IncidentNotificationEvent {
  return {
    type: 'incident_assigned',
    incidentId,
    title: 'New incident assignment',
    message: 'You have been assigned an incident. Review the details and acknowledge the assignment.',
    priority: 'high',
  };
}
