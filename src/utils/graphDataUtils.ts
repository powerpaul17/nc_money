import dayjs, { Dayjs } from 'dayjs';

import { ArrayUtils } from './arrayUtils';

export class GraphDataUtils {

  public static createBarGraphData({
    startDate = dayjs(),
    numberOfMonths = 12,
    callback
  }: {
    startDate?: Dayjs;
    numberOfMonths?: number;
    callback: (date: Dayjs) => number;
  }): Array<GraphData> {
    return ArrayUtils.createNumberArray(numberOfMonths)
      .map((num) => {
        const date = startDate.subtract(num, 'months');

        return {
          label: date.format('MMM'),
          value: callback(date)
        };
      })
      .reverse();
  }

}

type GraphData = {
  label: string;
  value: number;
};
