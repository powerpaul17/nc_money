import { NumberUtils } from '../utils/numberUtils';

export function useMathExpression(): {
  evaluate: (expression: string, previousValue?: number) => number
  } {

  function evaluate(expression: string, previousValue = 0.0): number {
    expression = expression.replace(/ /g, '');
    const result = addition(expression, previousValue);
    return NumberUtils.roundToPrecision(result);
  }

  function addition(expression: string, previousValue: number): number {
    const parts = split(expression, '+')
      .reduce<Array<number>>((prevVal, p, index) => {
        const result = subtraction(p, prevVal[index - 1] ?? previousValue);
        prevVal.push(result);
        return prevVal;
      }, []);
    return parts.reduce((sum, num) => sum + num, 0);
  }

  function subtraction(expression: string, previousValue: number): number {
    const parts = split(expression, '-')
      .reduce<Array<number>>((prevVal, p, index) => {
        const result = multiplication(p, prevVal[index - 1] ?? previousValue);
        prevVal.push(result);
        return prevVal;
      }, []);

    const initialValue = parts.shift();
    if (initialValue == undefined)
      throw new Error('cannot subtract without an initial value');

    return parts.reduce((sum, num) => sum - num, initialValue);
  }

  function multiplication(expression: string, previousValue: number): number {
    const parts = split(expression, '*')
      .reduce<Array<number>>((prevVal, p, index) => {
        const result = division(p, prevVal[index - 1] ?? previousValue);
        prevVal.push(result);
        return prevVal;
      }, []);
    return parts.reduce((sum, num) => sum * num, 1.0);
  }

  function division(expression: string, previousValue: number): number {
    const parts = split(expression, '/').map((p) => {
      if (p[0] === '(') {
        return addition(p.replace(/^\((.+)\)$/, '$1'), previousValue);
      }

      const num = parseFloat(p);

      if (p[p.length - 1] === '%') {
        return num / 100 * previousValue;
      }

      return num;
    });

    const initialValue = parts.shift();
    if (initialValue == undefined)
      throw new Error('cannot divide without an initial value');

    const result = parts.reduce((sum, num) => sum / num, initialValue);

    return result;
  }

  function split(expression: string, operator: string): Array<string> {
    const result = [];

    let braces = 0;
    let currentChunk = '';

    for (const currentChar of expression) {
      if (currentChar === '(') {
        braces++;
      } else if (currentChar === ')') {
        braces--;
      }
      if (braces == 0 && operator === currentChar) {
        if (currentChunk === '') currentChunk = '0';
        result.push(currentChunk);
        currentChunk = '';
      } else currentChunk += currentChar;
    }

    if (currentChunk !== '') {
      result.push(currentChunk);
    }

    return result;
  }

  return { evaluate };

}
