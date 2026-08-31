import { useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { WorkspaceContext } from './workspaceContext';
import { initialWorkspaceState, workspaceReducer } from './workspaceReducer';

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialWorkspaceState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
