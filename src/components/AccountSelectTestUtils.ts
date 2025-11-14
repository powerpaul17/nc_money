import { fireEvent } from '@testing-library/vue';

class AccountSelectTestUtils {
  public static openDropdown(element: HTMLElement): void {
    fireEvent.mouseDown(element);
  }
}
