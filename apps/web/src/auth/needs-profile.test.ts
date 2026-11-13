import { expect, it } from 'vitest';
import { needsProfile } from './auth-context';

it('asks only for a name after the first login', () => {
  expect(needsProfile({ name: '' })).toBe(true);
  expect(needsProfile({ name: '  ' })).toBe(true);
  expect(needsProfile({ name: 'Neha' })).toBe(false);
});
