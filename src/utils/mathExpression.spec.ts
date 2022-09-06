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
  });
});
