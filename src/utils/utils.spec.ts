import { describe, expect, it } from 'vitest';
import { Utils } from './utils';

describe('Utils', () => {
  describe('chunk', () => {
    it('should split an array into chunks', () => {
      const inputArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      expect(Utils.chunk(inputArray, 1)).to.deep.equal([
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9]
      ]);

      expect(Utils.chunk(inputArray, 3)).to.deep.equal([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9]
      ]);

      expect(Utils.chunk(inputArray, 4)).to.deep.equal([
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9]
      ]);

      expect(Utils.chunk(inputArray, 20)).to.deep.equal([
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      ]);
    });
  });

  describe('parseNumber', () => {
    it('should return a number of a string', () => {
      expect(Utils.parseNumber('123.456')).to.be.equal(123.456);
    });

    it('should return NaN if it is not a parseable number', () => {
      expect(Utils.parseNumber('abc')).to.be.NaN;
    });

    it('should respect decimal separator', () => {
      expect(Utils.parseNumber('123,456', ',')).to.be.equal(123.456);
    });

    it('should ignore thousand separators', () => {
      expect(Utils.parseNumber('12,345.678')).to.be.equal(12345.678);
      expect(Utils.parseNumber('12.456,789', ',')).to.be.equal(12456.789);
    });
  });
});
