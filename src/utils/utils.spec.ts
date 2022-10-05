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
});
