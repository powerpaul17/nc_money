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
});
