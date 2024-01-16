import { ArrayUtils } from './arrayUtils';

export class NumberUtils {
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

    const groupedBeforeDecimal = ArrayUtils.chunk(
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

  public static parseNumber(
    numberString: string,
    decimalSeparator = '.'
  ): number {
    return Number(
      numberString
        .replace(decimalSeparator, '#')
        .replace(/[\s,.]+/, '')
        .replace('#', '.')
    );
  }

  public static areEqual(num1: number, num2: number): boolean {
    return this.roundToPrecision(num1) === this.roundToPrecision(num2);
  }

  public static areNotEqual(num1: number, num2: number): boolean {
    return !this.areEqual(num1, num2);
  }

  public static roundToPrecision(
    number: number,
    precision: number = 10
  ): number {
    return (
      Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
    );
  }
}
