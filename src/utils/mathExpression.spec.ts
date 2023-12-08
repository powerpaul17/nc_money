import { describe, expect, it } from 'vitest';
import { useMathExpression } from './mathExpression';

describe('mathExpression', () => {
  it('should calculate the correct values', () => {
    const mathExpression = useMathExpression();

    expect(
      mathExpression.evaluate({ expression: '1 + 2 * 3 - 4 / 2' })
    ).to.equal(5);
    expect(
      mathExpression.evaluate({ expression: '(1 + 2) * 3 - 4 / 2' })
    ).to.equal(7);
    expect(
      mathExpression.evaluate({ expression: '(1 + 2) * (3 - 4) / 2' })
    ).to.equal(-1.5);
    expect(
      mathExpression.evaluate({ expression: '(0 - 1 + 2) * (3 - 4) / 2' })
    ).to.equal(-0.5);
    expect(
      mathExpression.evaluate({ expression: '(-1 + 2) * (3 - 4) / 2' })
    ).to.equal(-0.5);
    expect(
      mathExpression.evaluate({ expression: '-(1 + 2) * (3 - 4) / 2' })
    ).to.equal(1.5);

    expect(mathExpression.evaluate({ expression: '120 + 10 %' })).to.equal(132);
    expect(mathExpression.evaluate({ expression: '120 - 10 %' })).to.equal(108);
    expect(
      mathExpression.evaluate({ expression: '100 + 10 % - 25%' })
    ).to.equal(107.5);
    expect(
      mathExpression.evaluate({ expression: '(100 + 10 %) - 25%' })
    ).to.equal(82.5);
    expect(mathExpression.evaluate({ expression: '25%' })).to.equal(0.0);
    expect(
      mathExpression.evaluate({ expression: '25%', previousValue: 120 })
    ).to.equal(30);
    expect(mathExpression.evaluate({ expression: '100*2%' })).to.equal(200);

    expect(mathExpression.evaluate({ expression: '0.1 + 0.2' })).to.equal(0.3);
    expect(mathExpression.evaluate({ expression: '0.1 + 0.2 - 0.3' })).to.equal(
      0.0
    );
  });

  it('should respect locale settings for number format', () => {
    const mathExpression = useMathExpression();

    expect(
      mathExpression.evaluate({
        expression: '10.00,24 + 5.000,4',
        numberFormat: { decimalSeparator: ',', groupSeparator: '.' }
      })
    ).to.equal(6000.64);
  });
});
