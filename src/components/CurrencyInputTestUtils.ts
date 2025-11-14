import { fireEvent } from '@testing-library/vue';

export class CurrencyInputTestUtils {
  public static async enterValue(
    element: HTMLElement,
    value: string
  ): Promise<void> {
    await fireEvent.update(element, value);
    element.dispatchEvent(new Event('change'));
  }
}
