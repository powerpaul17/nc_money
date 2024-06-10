import { describe, expect, it, vi } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  type RenderOptions
} from '@testing-library/vue';
import { nextTick } from 'vue';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

import DateInput from './DateInput.vue';

describe('DateInput', () => {
  it('should display the current date', async () => {
    const date = new Date('2024-11-10');

    await setupEnvironment({
      renderOptions: {
        props: {
          date
        }
      }
    });

    const element = screen.getByRole('textbox');

    expect(element.value).to.equal('11/10/2024');
  });

  it('should format the date according to locale settings', async () => {
    const date = new Date('2024-11-10');

    await setupEnvironment({
      options: {
        locale: 'de'
      },
      renderOptions: {
        props: {
          date
        }
      }
    });

    const element = screen.getByRole('textbox');

    expect(element.value).to.equal('10.11.2024');
  });

  it('should send an event if date is changed', async () => {
    const dateChangedSpy = vi.fn();

    await setupEnvironment({
      renderOptions: {
        props: {
          date: new Date(),
          'onDate-changed': dateChangedSpy
        }
      }
    });

    const element = screen.getByRole('textbox');

    await fireEvent.update(element, '12/12/2024');
    element.dispatchEvent(new Event('change'));

    expect(dateChangedSpy.mock.calls[0]).toEqual([
      new Date('2024-12-12T00:00:00.000Z')
    ]);
  });

  it('should parse a localized date correctly', async () => {
    const dateChangedSpy = vi.fn();

    await setupEnvironment({
      options: { locale: 'de' },
      renderOptions: {
        props: { date: new Date(), 'onDate-changed': dateChangedSpy }
      }
    });

    const element = screen.getByRole('textbox');

    await fireEvent.update(element, '02.04.2020');
    element.dispatchEvent(new Event('change'));

    expect(dateChangedSpy.mock.calls[0]).toEqual([
      new Date('2020-04-02T00:00:00.000Z')
    ]);
  });

  async function setupEnvironment({
    options,
    renderOptions
  }: {
    options?: { locale?: string };
    renderOptions?: RenderOptions<typeof DateInput>;
  }): Promise<{
    updateProps: (
      props: NonNullable<RenderOptions<typeof DateInput>['props']>
    ) => Promise<void>;
  }> {
    vi.useFakeTimers({ now: 0 });

    dayjs.extend(customParseFormat);
    dayjs.extend(localizedFormat);
    dayjs.extend(utc);

    if (options?.locale) {
      import.meta.glob('../../node_modules/dayjs/locale/*.js', { eager: true });
      dayjs.locale(options.locale);
    }

    const renderResult = render(DateInput, renderOptions);

    await nextTick();

    return {
      updateProps: (props) => renderResult.rerender(props)
    };
  }
});
