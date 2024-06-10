import { describe, expect, it } from 'vitest';

import dayjs from 'dayjs';

import { DateUtils } from './DateUtils';

describe('DateUtils', () => {
  describe('getDateStringForTransaction', () => {
    it('should return the correct transaction date string for a date', () => {
      expect(
        DateUtils.getDateStringForTransaction(
          dayjs().year(2020).month(2).date(15).toDate()
        )
      ).toEqual('2020-03-15');
    });

    it('should return the correct transaction date string for a dayjs instance', () => {
      expect(
        DateUtils.getDateStringForTransaction(
          dayjs().year(2020).month(2).date(9)
        )
      ).toEqual('2020-03-09');
    });
  });
});
