'use client';

import { useSyncExternalStore } from 'react';
import type { ArenaState } from './workspaceStore';
import { workspaceStore } from './workspaceStore';

export const useWorkspaceState = <T>(selector: (state: ArenaState) => T) =>
  useSyncExternalStore(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (onStoreChange) => workspaceStore.subscribe((_state) => onStoreChange()),
    () => selector(workspaceStore.getState()),
    () => selector(workspaceStore.getState())
  );

export const useWorkspaceActions = () => workspaceStore;
