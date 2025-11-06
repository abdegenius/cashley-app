const isBrowser = typeof window !== "undefined";

export const getFromLocalStorage = (key: string): string | null =>
  isBrowser ? window.localStorage.getItem(key) : null;

export const setToLocalStorage = (key: string, value: string): void => {
  if (isBrowser) window.localStorage.setItem(key, value);
};

export const deleteFromLocalStorage = (key: string): void => {
  if (isBrowser) window.localStorage.removeItem(key);
};