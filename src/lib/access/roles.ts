export const BCONNECT_ROLES = [
  'resident',
  'responder',
  'official',
  'barangay_admin',
  'lgu_admin',
  'super_admin',
  'auditor',
] as const;

export type BConnectRole = (typeof BCONNECT_ROLES)[number];

export const ROLE_LABELS: Record<BConnectRole, string> = {
  resident: 'Resident',
  responder: 'Responder',
  official: 'Official',
  barangay_admin: 'Barangay Admin',
  lgu_admin: 'LGU Admin',
  super_admin: 'Super Admin',
  auditor: 'Auditor',
};

export const ROLE_LEVEL: Record<BConnectRole, number> = {
  resident: 10,
  responder: 20,
  official: 30,
  barangay_admin: 40,
  lgu_admin: 50,
  super_admin: 60,
  auditor: 70,
};

export type OrganizationScope = 'barangay' | 'lgu' | 'system';

export const ROLE_SCOPE: Record<BConnectRole, OrganizationScope> = {
  resident: 'barangay',
  responder: 'barangay',
  official: 'barangay',
  barangay_admin: 'barangay',
  lgu_admin: 'lgu',
  super_admin: 'system',
  auditor: 'system',
};

export function isBConnectRole(value: string): value is BConnectRole {
  return BCONNECT_ROLES.includes(value as BConnectRole);
}
