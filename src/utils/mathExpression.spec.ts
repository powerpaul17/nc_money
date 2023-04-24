import { describe, expect, it } from 'vitest';
import { useMathExpression } from './mathExpression';

describe('mathExpression', () => {
  it('should calculate the correct values', () => {
    const mathExpression = useMathExpression();
    expect(mathExpression.evaluate('1 + 2 * 3 - 4 / 2')).to.equal(5);
    expect(mathExpression.evaluate('(1 + 2) * 3 - 4 / 2')).to.equal(7);
    expect(mathExpression.evaluate('(1 + 2) * (3 - 4) / 2')).to.equal(-1.5);
    expect(mathExpression.evaluate('(0 - 1 + 2) * (3 - 4) / 2')).to.equal(-0.5);
    expect(mathExpression.evaluate('(-1 + 2) * (3 - 4) / 2')).to.equal(-0.5);
    expect(mathExpression.evaluate('-(1 + 2) * (3 - 4) / 2')).to.equal(1.5);

    expect(mathExpression.evaluate('120 + 10 %')).to.equal(132);
    expect(mathExpression.evaluate('120 - 10 %')).to.equal(108);
    expect(mathExpression.evaluate('100 + 10 % - 25%')).to.equal(107.5);
    expect(mathExpression.evaluate('(100 + 10 %) - 25%')).to.equal(82.5);
    expect(mathExpression.evaluate('25%')).to.equal(0.0);
    expect(mathExpression.evaluate('25%', 120)).to.equal(30);
    expect(mathExpression.evaluate('100*2%')).to.equal(200);

    expect(mathExpression.evaluate('0.1 + 0.2')).to.equal(0.3);
    expect(mathExpression.evaluate('0.1 + 0.2 - 0.3')).to.equal(0.0);
  });
});
