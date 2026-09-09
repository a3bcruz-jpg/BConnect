import { INCIDENT_CATEGORIES, type IncidentCategory, type IncidentLocation } from './types';

export type CreateIncidentInput = {
  description: string;
  category?: IncidentCategory;
  location?: IncidentLocation;
  mediaIds?: string[];
};

export type ValidationResult =
  | { ok: true; data: CreateIncidentInput }
  | { ok: false; errors: string[] };

const MAX_DESCRIPTION_LENGTH = 4000;
const MAX_MEDIA_IDS = 10;

export function validateCreateIncidentInput(value: unknown): ValidationResult {
  if (!value || typeof value !== 'object') {
    return { ok: false, errors: ['Request body must be a JSON object.'] };
  }

  const body = value as Record<string, unknown>;
  const errors: string[] = [];
  const description = typeof body.description === 'string' ? body.description.trim() : '';

  if (description.length < 5) errors.push('Description must be at least 5 characters.');
  if (description.length > MAX_DESCRIPTION_LENGTH) errors.push('Description is too long.');

  let category: IncidentCategory | undefined;
  if (body.category !== undefined) {
    if (typeof body.category !== 'string' || !INCIDENT_CATEGORIES.includes(body.category as IncidentCategory)) {
      errors.push('Invalid incident category.');
    } else {
      category = body.category as IncidentCategory;
    }
  }

  let location: IncidentLocation | undefined;
  if (body.location !== undefined) {
    if (!body.location || typeof body.location !== 'object') {
      errors.push('Location must be an object.');
    } else {
      const raw = body.location as Record<string, unknown>;
      const latitude = raw.latitude;
      const longitude = raw.longitude;
      if (latitude !== undefined && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
        errors.push('Latitude must be between -90 and 90.');
      }
      if (longitude !== undefined && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
        errors.push('Longitude must be between -180 and 180.');
      }
      location = {
        latitude: typeof latitude === 'number' ? latitude : undefined,
        longitude: typeof longitude === 'number' ? longitude : undefined,
        accuracyMeters: typeof raw.accuracyMeters === 'number' && raw.accuracyMeters >= 0 ? raw.accuracyMeters : undefined,
        address: typeof raw.address === 'string' ? raw.address.trim().slice(0, 500) : undefined,
        landmark: typeof raw.landmark === 'string' ? raw.landmark.trim().slice(0, 300) : undefined,
      };
    }
  }

  let mediaIds: string[] | undefined;
  if (body.mediaIds !== undefined) {
    if (!Array.isArray(body.mediaIds) || body.mediaIds.length > MAX_MEDIA_IDS || body.mediaIds.some((id) => typeof id !== 'string' || id.length > 200)) {
      errors.push(`mediaIds must contain at most ${MAX_MEDIA_IDS} valid IDs.`);
    } else {
      mediaIds = [...new Set(body.mediaIds as string[])];
    }
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { description, category, location, mediaIds } };
}
