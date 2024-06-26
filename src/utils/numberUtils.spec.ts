import { describe, expect, it } from 'vitest';

import { NumberUtils } from './numberUtils';

describe('NumberUtils', () => {
  describe('formatNumber', () => {
    it('should format the number', () => {
      expect(NumberUtils.formatNumber(123456.789, {})).to.be.equal(
        '123 456.79'
      );
    });

    it('should use the specified decimal separator', () => {
      expect(
        NumberUtils.formatNumber(123456.789, { decimalSeparator: ',' })
      ).to.be.equal('123 456,79');
    });

    it('should use the specified group separator', () => {
      expect(
        NumberUtils.formatNumber(123456.789, { groupSeparator: ',' })
      ).to.be.equal('123,456.79');
    });

    it('should show the desired number of decimals', () => {
      expect(NumberUtils.formatNumber(123456.789, { decimals: 5 })).to.be.equal(
        '123 456.78900'
      );
    });

    it('should round a number correctly', () => {
      expect(NumberUtils.formatNumber(123456.789, { decimals: 1 })).to.be.equal(
        '123 456.8'
      );

      expect(NumberUtils.formatNumber(123456.749, { decimals: 1 })).to.be.equal(
        '123 456.7'
      );
    });

    it('should group the digits correctly', () => {
      expect(NumberUtils.formatNumber(123456.789, { groupBy: 2 })).to.be.equal(
        '12 34 56.79'
      );

      expect(NumberUtils.formatNumber(123456.789, { groupBy: 4 })).to.be.equal(
        '12 3456.79'
      );
    });

    it('should not group number if groupBy is 0', () => {
      expect(NumberUtils.formatNumber(123456.789, { groupBy: 0 })).to.be.equal(
        '123456.79'
      );
    });
  });

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

  const shouldBeZero = 0.1 + 0.2 - 0.3;

  describe('areEqual', () => {
    it('should return true if numbers are equal', () => {
      expect(NumberUtils.areEqual(shouldBeZero, 0.0)).to.be.true;
      expect(NumberUtils.areEqual(0.0, shouldBeZero)).to.be.true;
    });

    it('should return false if numbers are not equal', () => {
      expect(NumberUtils.areEqual(0.300000005, 0.3)).to.be.false;
    });
  });

  describe('areNotEqual', () => {
    it('should return true if numbers are not equal', () => {
      expect(NumberUtils.areNotEqual(0.300000005, 0.3)).to.be.true;
    });

    it('should return false if numbers are equal', () => {
      expect(NumberUtils.areNotEqual(shouldBeZero, 0.0)).to.be.false;
      expect(NumberUtils.areNotEqual(0.0, shouldBeZero)).to.be.false;
    });
  });

  describe('roundToPrecision', () => {
    it('should round a number to a precision', () => {
      expect(NumberUtils.roundToPrecision(0.12345678, 2)).to.equal(0.12);
      expect(NumberUtils.roundToPrecision(0.1 + 0.2)).to.equal(0.3);
    });
  });
});
