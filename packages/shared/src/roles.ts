export const ROLES = ['requester', 'hod', 'transport_manager', 'super_admin'] as const;
export type Role = (typeof ROLES)[number];
