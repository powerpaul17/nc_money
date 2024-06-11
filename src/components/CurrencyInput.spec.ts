import { describe, expect, it, vi } from 'vitest';
import {
  render,
  type RenderOptions,
  screen,
  fireEvent
} from '@testing-library/vue';

import CurrencyInput from './CurrencyInput.vue';
import { nextTick } from 'vue';

describe('CurrencyInput', () => {
  it('should show the value', async () => {
    await setupEnvironment({
      props: {
        value: 123.456
      }
    });

    const element = screen.getByRole<HTMLInputElement>('textbox');

    expect(element.value).to.equal('123.46');
  });

  it('should change the shown value if prop is changed', async () => {
    const { updateProps } = await setupEnvironment({
      props: {
        value: 123.456
      }
    });

    await updateProps({
      value: 456
    });

    const element = screen.getByRole<HTMLInputElement>('textbox');

    expect(element.value).to.equal('456.00');
  });

  it('should emit an event if value has changed', async () => {
    const valueChangedSpy = vi.fn();

    await setupEnvironment({
      props: {
        value: 100,
        'onValue-changed': valueChangedSpy
      }
    });

    const element = screen.getByRole('textbox');

    await fireEvent.update(element, '120');
    element.dispatchEvent(new Event('change'));

    expect(valueChangedSpy.mock.calls[0]).toEqual([120]);
  });

  it('should show the inverted value if prop is set', async () => {
    await setupEnvironment({
      props: {
        value: 789,
        invertedValue: true
      }
    });

    const element = screen.getByRole<HTMLInputElement>('textbox');

    expect(element.value).to.equal('-789.00');
  });

  it('should not allow editing the value if component is disabled', async () => {
    const { updateProps } = await setupEnvironment({
      props: {
        value: 100
      }
    });

    const element = screen.getByRole<HTMLInputElement>('textbox');

    expect(element.disabled).to.equal(false);

    await updateProps({
      value: 100,
      editable: false
    });

    expect(element.disabled).to.equal(true);
  });

  async function setupEnvironment(
    renderOptions: RenderOptions<typeof CurrencyInput>
  ): Promise<{
    updateProps: (
      props: NonNullable<RenderOptions<typeof CurrencyInput>['props']>
    ) => Promise<void>;
  }> {
    const renderResult = render(CurrencyInput, renderOptions);

    await nextTick();

    return {
      updateProps: (props) => renderResult.rerender(props)
    };
  }
});
