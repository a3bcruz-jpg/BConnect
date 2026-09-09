import type { IncidentStatus } from '../incidents/status';
import type { IncidentPriority } from '../incidents/priority';
import { notificationForAssignment, notificationForIncidentCreated } from './events';
import type { IncidentNotificationEvent } from './events';

export function buildIncidentNotificationEvent(input: {
  incidentId: string;
  status?: IncidentStatus;
  priority: IncidentPriority;
  assigned?: boolean;
}): IncidentNotificationEvent | null {
  if (input.assigned) return notificationForAssignment(input.incidentId);

  if (input.status === 'submitted' || input.status === 'pending_verification') {
    return notificationForIncidentCreated(input.incidentId, input.priority);
  }

  return null;
}
