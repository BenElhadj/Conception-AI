import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export function persisted(key, initialValue) {
  // Valeur initiale (safe SSR)
  const startValue = (() => {
    if (!browser) return initialValue;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  })();

  const store = writable(startValue);

  // Synchronisation locale (seulement dans le navigateur)
  if (browser) {
    store.subscribe((val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {
        // ignore quota/JSON errors
      }
    });
  }

  return store;
}
