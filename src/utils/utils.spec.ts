import { describe, expect, it } from 'vitest';
import { Utils } from './utils';

describe('utils', () => {
  describe('upperCaseFirstLetter', () => {
    it('should use upper case for the first letter', () => {
      expect(
        ['', 'a', 'monthly account'].map(Utils.upperCaseFirstLetter)
      ).toEqual(['', 'A', 'Monthly account']);
    });
  });
});
