import { createContext, useContext } from 'react';
import type { Dispatch } from 'react';
import type { WorkspaceAction, WorkspaceState } from './workspaceReducer';

export interface WorkspaceContextValue {
  state: WorkspaceState;
  dispatch: Dispatch<WorkspaceAction>;
}

/**
 * Kept in its own module (no component exports) so React Fast Refresh never
 * recreates the context identity while the provider component hot-reloads.
 */
export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('useWorkspace must be used inside a WorkspaceProvider');
  return value;
}
