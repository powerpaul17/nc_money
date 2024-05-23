export class ArrayUtils {
  public static chunk<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
    if (chunkSize === 0) return [array];

    return array.reduce<Array<Array<T>>>((chunks, item, index) => {
      return index % chunkSize === 0
        ? [...chunks, [item]]
        : [...chunks.slice(0, -1), [...(chunks.slice(-1)[0] ?? []), item]];
    }, []);
  }

  public static createNumberArray(count: number): Array<number> {
    return Array.from(Array(count).keys());
  }
}
