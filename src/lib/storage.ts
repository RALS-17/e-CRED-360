import type { Provider } from '../data/mockData';
import { mockProviders } from '../data/mockData';

/** Bump key when schema changes so old localStorage is replaced by new mock data */
const STORAGE_KEY = 'ecred360_providers_v5';

export function loadProviders(): Provider[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProviders));
      return [...mockProviders];
    }
    return JSON.parse(raw) as Provider[];
  } catch {
    return [...mockProviders];
  }
}

export function saveProviders(providers: Provider[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
}

export function makeInitials(name: string): string {
  return name
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

export function nextProviderId(providers: Provider[]): string {
  const nums = providers
    .map((p) => parseInt(p.id.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `P-${String(max + 1).padStart(3, '0')}`;
}
