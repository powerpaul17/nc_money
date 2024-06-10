import { describe, expect, it, vi } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  type RenderOptions
} from '@testing-library/vue';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

import DateInput from './DateInput.vue';

describe('DateInput', () => {
  it('should display the current date', () => {
    const date = new Date('2024-11-10');

    setupEnvironment({
      renderOptions: {
        props: {
          date
        }
      }
    });

    const element = screen.getByRole('textbox');

    expect(element.value).to.equal('11/10/2024');
  });

  it('should format the date according to locale settings', () => {
    const date = new Date('2024-11-10');

    setupEnvironment({
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

    setupEnvironment({
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

  function setupEnvironment({
    options,
    renderOptions
  }: {
    options?: { locale?: string };
    renderOptions?: RenderOptions<typeof DateInput>;
  }): {
    updateProps: (props: Object) => Promise<void>;
  } {
    vi.useFakeTimers({ now: 0 });

    dayjs.extend(localizedFormat);
    dayjs.extend(utc);

    if (options?.locale) {
      import.meta.glob('../../node_modules/dayjs/locale/*.js', { eager: true });
      dayjs.locale(options.locale);
    }

    const renderResult = render(DateInput, renderOptions);

    return {
      updateProps: (props) => renderResult.rerender(props)
    };
  }
});
