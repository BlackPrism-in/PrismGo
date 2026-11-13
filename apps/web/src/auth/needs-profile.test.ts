import { expect, it } from 'vitest';
import { needsProfile } from './auth-context';

const dept = { id: 'd', name: 'Ops' };

it('asks new requesters for their name and department', () => {
  expect(needsProfile({ name: '', roles: ['requester'], department: null })).toBe(true);
  expect(needsProfile({ name: 'Neha', roles: ['requester'], department: null })).toBe(true);
  expect(needsProfile({ name: 'Neha', roles: ['requester'], department: dept })).toBe(false);
});

it('never blocks admins without a department', () => {
  expect(needsProfile({ name: 'Asha', roles: ['super_admin'], department: null })).toBe(false);
});
