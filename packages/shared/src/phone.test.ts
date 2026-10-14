import { describe, expect, it } from 'vitest';
import { formatIndianMobile, normalizeIndianMobile } from './phone';

describe('normalizeIndianMobile', () => {
  it.each([
    ['9812345678', '+919812345678'],
    ['09812345678', '+919812345678'],
    ['919812345678', '+919812345678'],
    ['+91 98123 45678', '+919812345678'],
    ['+91-98123-45678', '+919812345678'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeIndianMobile(input)).toBe(expected);
  });

  it.each(['12345', '5812345678', '+14155550100', '98123456789', 'abcdefghij'])(
    'rejects %s',
    (input) => {
      expect(normalizeIndianMobile(input)).toBeNull();
    },
  );
});

describe('formatIndianMobile', () => {
  it('groups digits for display', () => {
    expect(formatIndianMobile('+919812345678')).toBe('+91 98123 45678');
  });
});
