export function buildFallbackIncidentReference(date = new Date()): string {
  const year = date.getUTCFullYear();
  const suffix = `${date.getTime()}`.slice(-6).padStart(6, '0');
  return `BC-${year}-${suffix}`;
}
