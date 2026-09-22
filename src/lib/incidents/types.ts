export const INCIDENT_CATEGORIES = [
  'fire',
  'medical',
  'accident',
  'crime_safety',
  'flood',
  'landslide',
  'earthquake',
  'missing_person',
  'road_hazard',
  'infrastructure_damage',
  'electrical_hazard',
  'environmental',
  'other',
] as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];

export const INCIDENT_PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;
export type IncidentPriority = (typeof INCIDENT_PRIORITIES)[number];

export const INCIDENT_STATUSES = [
  'draft',
  'queued_offline',
  'submitted',
  'ai_processing',
  'pending_verification',
  'verified',
  'assigned',
  'accepted',
  'responding',
  'on_site',
  'resolved',
  'closed',
  'rejected',
  'duplicate',
  'cancelled',
] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export type IncidentLocation = {
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  address?: string;
  landmark?: string;
};

export type IncidentReportDraft = {
  description: string;
  category?: IncidentCategory;
  location?: IncidentLocation;
  mediaIds?: string[];
};

export type AIIncidentAnalysis = {
  category: IncidentCategory;
  subcategory?: string;
  priority: IncidentPriority;
  confidence: 'high' | 'medium' | 'low';
  summary: string;
  extractedInformation: Record<string, unknown>;
  missingInformation: string[];
  safetyFlags: string[];
};
