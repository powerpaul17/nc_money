import { afterEach, describe, expect, it } from 'vitest';
import { render, type RenderOptions } from '@testing-library/vue';

import { resetSettingStore, useSettingStore } from '../stores/settingStore';

import CurrencyText from './CurrencyText.vue';

describe('CurrencyText', () => {
  it('should render correct amount of decimals', async () => {
    const { container, updateProps } = setupEnvironment({
      props: {
        value: 0.123
      }
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('0.12');

    await updateProps({
      value: 0.1
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('0.10');

    await updateProps({
      value: 0.195
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('0.20');
  });

  it('should use correct decimal separator', () => {
    const settingStore = useSettingStore();
    settingStore.numberFormat_decimalSeparator.value = ',';

    const { container } = render(CurrencyText, {
      props: {
        value: 0.123
      }
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('0,12');
  });

  it('should group digits correctly', async () => {
    const settingStore = useSettingStore();

    const { container, updateProps } = setupEnvironment({
      props: {
        value: 1234
      }
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('1 234.00');

    await updateProps({
      value: 123456
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('123 456.00');

    await updateProps({
      value: -123456
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal(
      '-123 456.00'
    );

    settingStore.numberFormat_groupBy.value = 2;

    await updateProps({
      value: 123456
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal(
      '12 34 56.00'
    );
  });

  it('should use correct group separator', () => {
    const settingStore = useSettingStore();
    settingStore.numberFormat_decimalSeparator.value = ',';
    settingStore.numberFormat_groupSeparator.value = '.';

    const { container } = render(CurrencyText, {
      props: {
        value: 1234
      }
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('1.234,00');
  });

  it('should show inverted values if enabled', async () => {
    const { container, updateProps } = setupEnvironment({
      props: {
        value: -123.456,
        invertedValue: true
      }
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('123.46');

    await updateProps({
      value: 123.456
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('-123.46');

    await updateProps({
      value: 0.0
    });

    expect(container.firstChild?.textContent?.trim()).to.be.equal('0.00');
  });

  afterEach(() => {
    resetSettingStore();
  });

  function setupEnvironment(renderOptions: RenderOptions<CurrencyText>): {
    container: Element;
    updateProps: (props: Object) => Promise<void>;
  } {
    const renderResult = render(CurrencyText, renderOptions);

    return {
      container: renderResult.container,
      updateProps: (props) => renderResult.rerender(props)
    };
  }
});
