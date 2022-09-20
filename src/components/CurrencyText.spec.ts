import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/vue';

import CurrencyText from './CurrencyText.vue';

describe('CurrencyText', () => {
  it('should render correct amount of decimals', async () => {
    const { container, rerender } = render(CurrencyText, {
      props: {
        value: 0.123
      }
    });

    expect(container.firstChild?.textContent).to.be.equal('0.12');

    await rerender({
      value: 0.1
    });

    expect(container.firstChild?.textContent).to.be.equal('0.10');

    await rerender({
      value: 0.195
    });

    expect(container.firstChild?.textContent).to.be.equal('0.20');
  });

  it('should use correct decimal separator', () => {
    const { container } = render(CurrencyText, {
      props: {
        value: 0.123,
        decimalSeparator: ','
      }
    });

    expect(container.firstChild?.textContent).to.be.equal('0,12');
  });

  it('should group digits correctly', async () => {
    const { container, rerender } = render(CurrencyText, {
      props: {
        value: 1234
      }
    });

    expect(container.firstChild?.textContent).to.be.equal('1 234.00');

    await rerender({
      value: 123456
    });

    expect(container.firstChild?.textContent).to.be.equal('123 456.00');

    await rerender({
      value: -123456
    });

    expect(container.firstChild?.textContent).to.be.equal('-123 456.00');

    await rerender({
      value: 123456,
      groupBy: '2'
    });

    expect(container.firstChild?.textContent).to.be.equal('12 34 56.00');
  });

  it('should use correct group separator', async () => {
    const { container } = render(CurrencyText, {
      props: {
        value: 1234,
        decimalSeparator: ',',
        groupSeparator: '.'
      }
    });

    expect(container.firstChild?.textContent).to.be.equal('1.234,00');
  });
});
