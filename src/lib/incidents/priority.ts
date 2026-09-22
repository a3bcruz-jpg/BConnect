export const INCIDENT_PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;
export type IncidentPriority = (typeof INCIDENT_PRIORITIES)[number];

export function isIncidentPriority(value: unknown): value is IncidentPriority {
  return typeof value === 'string' && INCIDENT_PRIORITIES.includes(value as IncidentPriority);
}

export const PRIORITY_ORDER: Record<IncidentPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};
