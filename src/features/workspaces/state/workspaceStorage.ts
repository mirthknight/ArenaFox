import type { ArenaState, PartialArenaState } from './workspaceStore';

const DEFAULT_STORAGE_KEY = 'arenafox-workspace-state';

export const loadStateFromStorage = (storageKey: string = DEFAULT_STORAGE_KEY): PartialArenaState => {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    return JSON.parse(raw) as PartialArenaState;
  } catch (error) {
    console.warn('[workspaceStorage] Failed to load state from storage', error);
    return {};
  }
};

export const saveStateToStorage = (state: ArenaState, storageKey: string = DEFAULT_STORAGE_KEY) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.warn('[workspaceStorage] Failed to save state to storage', error);
  }
};

export const clearStateFromStorage = (storageKey: string = DEFAULT_STORAGE_KEY) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.warn('[workspaceStorage] Failed to clear state from storage', error);
  }
};
