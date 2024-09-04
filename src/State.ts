import type { AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

export type GlobusAuthState = {
  isAuthenticated: boolean;
  error: Error | undefined;
  authorization: AuthorizationManager | undefined;
  events: AuthorizationManager["events"] | undefined;
};

export const initialState: GlobusAuthState = {
  isAuthenticated: false,
  error: undefined,
  authorization: undefined,
  events: undefined,
};
