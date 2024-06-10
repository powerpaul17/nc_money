import { describe, expect, it } from 'vitest';

import { ArrayUtils } from './arrayUtils';

describe('ArrayUtils', () => {
  describe('chunk', () => {
    it('should split an array into chunks', () => {
      const inputArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      expect(ArrayUtils.chunk(inputArray, 1)).to.deep.equal([
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

      expect(ArrayUtils.chunk(inputArray, 3)).to.deep.equal([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9]
      ]);

      expect(ArrayUtils.chunk(inputArray, 4)).to.deep.equal([
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9]
      ]);

      expect(ArrayUtils.chunk(inputArray, 20)).to.deep.equal([
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      ]);
    });

    it('should not split an array if chunk size is 0', () => {
      const inputArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      expect(ArrayUtils.chunk(inputArray, 0)).to.deep.equal([
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      ]);
    });
  });

  describe('createNumberArray', () => {
    it('should create an array with the specified number of increasing numbers', () => {
      expect(ArrayUtils.createNumberArray(10)).to.deep.equal([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9
      ]);
    });
  });
});
