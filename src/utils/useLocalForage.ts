import localforage from 'localforage';

export function useLocalForage<T>(
  storageKey: string,
  storeName = 'settings'
): {
  setItemInKey: (itemId: number, value: T) => Promise<void>;
  getItemInKey: (itemId: number) => Promise<T | undefined>;
} {
  localforage.config({
    name: 'money',
    storeName
  });

  return {
    getItemInKey: async (itemId): Promise<T | undefined> => {
      const keyValue = await localforage.getItem<Record<number, T>>(storageKey);

      return keyValue?.[itemId];
    },
    setItemInKey: async (itemId, value): Promise<void> => {
      const status = await localforage.getItem<Record<number, T>>(storageKey);

      await localforage.setItem('bookCollapsedStatus', {
        ...status,
        [itemId]: value
      });
    }
  };
}
