export type IncidentStatus =
  | 'submitted'
  | 'ai_processing'
  | 'pending_verification'
  | 'verified'
  | 'rejected'
  | 'duplicate'
  | 'assigned'
  | 'accepted'
  | 'responding'
  | 'on_site'
  | 'resolved'
  | 'closed'
  | 'cancelled';

const transitions: Record<IncidentStatus, readonly IncidentStatus[]> = {
  submitted: ['ai_processing', 'pending_verification', 'rejected', 'duplicate', 'cancelled'],
  ai_processing: ['pending_verification'],
  pending_verification: ['verified', 'rejected', 'duplicate', 'cancelled'],
  verified: ['assigned', 'cancelled'],
  assigned: ['accepted', 'cancelled'],
  accepted: ['responding', 'cancelled'],
  responding: ['on_site', 'cancelled'],
  on_site: ['resolved'],
  resolved: ['closed'],
  rejected: [],
  duplicate: [],
  closed: [],
  cancelled: [],
};

export function canTransition(from: IncidentStatus, to: IncidentStatus) {
  return transitions[from]?.includes(to) ?? false;
}

export function isTerminalStatus(status: IncidentStatus) {
  return transitions[status].length === 0;
}
