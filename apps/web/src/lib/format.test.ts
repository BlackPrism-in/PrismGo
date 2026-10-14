import { expect, it } from 'vitest';
import { timeAgo } from './format';

const now = Date.parse('2026-10-14T12:00:00Z');

it('describes recent times relatively', () => {
  expect(timeAgo('2026-10-14T11:59:40Z', now)).toBe('just now');
  expect(timeAgo('2026-10-14T11:45:00Z', now)).toBe('15 min ago');
  expect(timeAgo('2026-10-14T09:00:00Z', now)).toBe('3 h ago');
});
