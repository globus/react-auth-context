import { type GlobusAuthState } from "./State";

export type Action = { type: "AUTHENTICATED"; payload: boolean } | { type: "REVOKE" } | { type: "BOOTSTRAPPED" };

export const reducer = (
  state: GlobusAuthState,
  action: Action,
): GlobusAuthState => {
  switch (action.type) {
    case "AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case "REVOKE":
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
