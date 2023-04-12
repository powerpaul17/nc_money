import { ArrayUtils } from './arrayUtils';

export class Utils {

  public static getValueOfCSSVar(cssVar: string): string {
    return getComputedStyle(document.body)
      .getPropertyValue(cssVar);
  }

  public static convertHexToRgba(hexColor: string, opacity = 1.0): string {
    const hexColorString = hexColor.toUpperCase().replace('#', '');

    const hexColorValues = ArrayUtils.chunk(hexColorString.split(''), 2).map(s => s.join(''));
    if (hexColorValues.length !== 3) throw new Error('expected 3 hex values');

    return `rgba(${Number(`0x${hexColorValues[0]}`)}, ${Number(`0x${hexColorValues[1]}`)}, ${Number(`0x${hexColorValues[2]}`)}, ${opacity})`;
  }

}
