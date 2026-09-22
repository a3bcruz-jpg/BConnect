import type { IncidentPriority } from './priority';
import type { IncidentStatus } from './status';

export type IncidentUpdatePayload = {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  assigned_to?: string;
  note?: string;
};

export function buildIncidentUpdate(payload: IncidentUpdatePayload, now = new Date().toISOString()) {
  const update: Record<string, unknown> = { updated_at: now };

  if (payload.status) {
    update.status = payload.status;
    if (payload.status === 'verified') update.verified_at = now;
    if (payload.status === 'assigned') update.assigned_at = now;
    if (payload.status === 'responding') update.responding_at = now;
    if (payload.status === 'on_site') update.on_site_at = now;
    if (payload.status === 'resolved') update.resolved_at = now;
    if (payload.status === 'closed') update.closed_at = now;
  }

  if (payload.priority) update.priority = payload.priority;
  if (payload.assigned_to) update.assigned_to = payload.assigned_to;

  return update;
}
