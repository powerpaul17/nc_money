export class Utils {
  public static chunk<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
    return array.reduce<Array<Array<T>>>((chunks, item, index) => {
      return index % chunkSize === 0
        ? [...chunks, [item]]
        : [...chunks.slice(0, -1), [...chunks.slice(-1)[0], item]];
    }, []);
  }

  public static formatNumber(
    value: number,
    options: {
      decimals?: number;
      decimalSeparator?: string;
      groupBy?: number;
      groupSeparator?: string;
      invertedValue?: boolean;
    }
  ): string {
    const {
      decimals,
      decimalSeparator,
      groupBy,
      groupSeparator,
      invertedValue
    } = Object.assign(
      {
        decimals: 2,
        decimalSeparator: '.',
        groupBy: 3,
        groupSeparator: ' ',
        invertedValue: false
      },
      options
    );
    const negativeValue = value < 0;
    const numberString = Math.abs(value).toFixed(decimals);

    const decimalSplitParts = numberString.split('.');
    const beforeDecimal = decimalSplitParts[0];
    if (!beforeDecimal) throw new Error('invalid number');

    const decimalDigits = decimalSplitParts[1];

    const groupedBeforeDecimal = Utils.chunk(
      Array.from(beforeDecimal).reverse(),
      groupBy
    )
      .reverse()
      .map((a) => a.reverse().join(''))
      .join(groupSeparator);

    return `${
      negativeValue != invertedValue && value !== 0 ? '-' : ''
    }${groupedBeforeDecimal}${
      decimalDigits ? `${decimalSeparator}${decimalDigits}` : ''
    }`;
  }

  public static parseNumber(numberString: string, decimalSeparator = '.'): number {
    return Number(
      numberString
        .replace(decimalSeparator, '#')
        .replace(/[\s,.]+/, '')
        .replace('#', '.'));
  }

}
