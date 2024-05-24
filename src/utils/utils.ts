import { ArrayUtils } from './arrayUtils';

export class Utils {
  public static getValueOfCSSVar(cssVar: string): string {
    return getComputedStyle(document.body).getPropertyValue(cssVar);
  }

  public static convertHexToRgba(hexColor: string, opacity = 1.0): string {
    const hexColorString = hexColor.toUpperCase().replace('#', '');

    const hexColorValues = ArrayUtils.chunk(hexColorString.split(''), 2).map(
      (s) => s.join('')
    );

    const red = hexColorValues[0];
    const green = hexColorValues[1];
    const blue = hexColorValues[2];

    if (!red || !green || !blue) throw new Error('expected 3 hex values');

    return `rgba(${Number(`0x${red}`)}, ${Number(`0x${green}`)}, ${Number(
      `0x${blue}`
    )}, ${opacity})`;
  }
}
