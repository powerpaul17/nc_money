import { describe, expect, it } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  type RenderOptions
} from '@testing-library/vue';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

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
    const { emitted } = setupEnvironment({});

    const element = screen.getByRole('textbox');

    await fireEvent.update(element, '12/12/2024');
    element.dispatchEvent(new Event('change'));

    expect(emitted()).toHaveProperty('date-changed');
    expect(emitted()['date-changed']).toHaveLength(1);
    expect(emitted()['date-changed'][0]).toEqual([
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
    container: Element;
    updateProps: (props: Object) => Promise<void>;
    emitted: () => void;
  } {
    dayjs.extend(localizedFormat);

    if (options?.locale) {
      import.meta.glob('../../node_modules/dayjs/locale/*.js', { eager: true });
      dayjs.locale(options.locale);
    }

    const renderResult = render(DateInput, renderOptions);

    return {
      container: renderResult.container,
      updateProps: (props) => renderResult.rerender(props),
      emitted: (eventName?: string) => renderResult.emitted(eventName)
    };
  }
});
