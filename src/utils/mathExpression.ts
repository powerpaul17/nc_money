export function useMathExpression() {
  function evaluate(expression: string): number {
    expression = expression.replaceAll(' ', '');
    return addition(expression);
  }

  function addition(expression: string): number {
    const parts = split(expression, '+').map((p) => subtraction(p));
    return parts.reduce((sum, num) => sum + num, 0);
  }

  function subtraction(expression: string): number {
    const parts = split(expression, '-').map((p) => multiplication(p));

    const initialValue = parts.shift();
    if (!initialValue)
      throw new Error('cannot subtract without an initial value');

    return parts.reduce((sum, num) => sum - num, initialValue);
  }

  function multiplication(expression: string): number {
    const parts = split(expression, '*').map((p) => division(p));
    return parts.reduce((sum, num) => sum * num, 1.0);
  }

  function division(expression: string): number {
    const parts = split(expression, '/').map((p) => {
      if (p[0] === '(') {
        return addition(p.replace(/^\((.+)\)$/, '$1'));
      }

      return parseFloat(p);
    });

    const initialValue = parts.shift();
    if (!initialValue)
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
      if (braces == 0 && operator == currentChar) {
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
