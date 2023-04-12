import { ArrayUtils } from './arrayUtils';

export class GraphDataUtils {

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
