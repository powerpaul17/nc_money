import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/vue';
import { createTestingPinia } from '@pinia/testing';

import { useSettingStore } from '../stores/settingStore';

import CurrencyText from './CurrencyText.vue';

describe('CurrencyText', () => {

  it('should render correct amount of decimals', async () => {
    const { container, rerender } = render(CurrencyText, {
      global: {
        plugins: [ createTestingPinia() ]
      },
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
    const pinia = createTestingPinia();

    const settingStore = useSettingStore();
    settingStore.numberFormat_decimalSeparator = ',';

    const { container } = render(CurrencyText, {
      global: {
        plugins: [ pinia ]
      },
      props: {
        value: 0.123
      }
    });

    expect(container.firstChild?.textContent).to.be.equal('0,12');
  });

  it('should group digits correctly', async () => {
    const pinia = createTestingPinia();

    const settingStore = useSettingStore();

    const { container, rerender } = render(CurrencyText, {
      global: {
        plugins: [ pinia ]
      },
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

    settingStore.numberFormat_groupBy = 2;

    await rerender({
      value: 123456
    });

    expect(container.firstChild?.textContent).to.be.equal('12 34 56.00');
  });

  it('should use correct group separator', async () => {
    const pinia = createTestingPinia();

    const settingStore = useSettingStore();
    settingStore.numberFormat_decimalSeparator = ',';
    settingStore.numberFormat_groupSeparator = '.';

    const { container } = render(CurrencyText, {
      global: {
        plugins: [ pinia ]
      },
      props: {
        value: 1234
      }
    });

    expect(container.firstChild?.textContent).to.be.equal('1.234,00');
  });

  it('should show inverted values if enabled', async () => {
    const { container, rerender } = render(CurrencyText, {
      global: {
        plugins: [ createTestingPinia() ]
      },
      props: {
        value: -123.456,
        invertedValue: true
      }
    });

    expect(container.firstChild?.textContent).to.be.equal('123.46');

    await rerender({
      value: 123.456
    });

    expect(container.firstChild?.textContent).to.be.equal('-123.46');

    await rerender({
      value: 0.0
    });

    expect(container.firstChild?.textContent).to.be.equal('0.00');
  });

});
