import dayjs, { Dayjs } from 'dayjs';

import { ArrayUtils } from './arrayUtils';

export class GraphDataUtils {

  public static createLineGraphData({
    startDate = dayjs(),
    startValue,
    numberOfMonths = 12,
    callback
  }: {
    startDate?: Dayjs;
    startValue: number;
    numberOfMonths?: number;
    callback: (date: Dayjs) => number;
  }): Array<GraphData> {
    const data = this.createBackwardsCalculatedGraphData({
      initialValue: {
        label: startDate.format('MMM'),
        value: startValue
      },
      numberOfPoints: numberOfMonths,
      callback: (num, value) => {
        const date = startDate.subtract(num, 'months');

        return {
          label: date.subtract(1, 'month').format('MMM'),
          value: value - callback(date)
        };
      }
    });

    return data;
  }

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

  public static createBackwardsCalculatedGraphData({
    initialValue,
    numberOfPoints,
    callback
  }: {
    initialValue: GraphData;
    numberOfPoints: number;
    callback: (num: number, data: number) => GraphData;
  }): Array<GraphData> {
    const value = {
      label: initialValue.label,
      value: initialValue.value
    };

    const data = ArrayUtils.createNumberArray(numberOfPoints)
      .map((num) => {
        const newValue = callback(num, value.value);
        value.value = newValue.value;
        return newValue;
      })
      .reverse();

    data.push(initialValue);

    return data;
  }

}

type GraphData = {
  label: string;
  value: number;
};
