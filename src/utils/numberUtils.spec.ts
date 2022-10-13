import { describe, expect, it } from 'vitest';

import { NumberUtils } from './numberUtils';

describe('NumberUtils', () => {

  describe('parseNumber', () => {

    it('should return a number of a string', () => {
      expect(NumberUtils.parseNumber('123.456')).to.be.equal(123.456);
    });

    it('should return NaN if it is not a parseable number', () => {
      expect(NumberUtils.parseNumber('abc')).to.be.NaN;
    });

    it('should respect decimal separator', () => {
      expect(NumberUtils.parseNumber('123,456', ',')).to.be.equal(123.456);
    });

    it('should ignore thousand separators', () => {
      expect(NumberUtils.parseNumber('12,345.678')).to.be.equal(12345.678);
      expect(NumberUtils.parseNumber('12.456,789', ',')).to.be.equal(12456.789);
    });

  });

});
