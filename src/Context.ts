import { createContext } from "react";
import type { GlobusAuthState } from "./State";

export type GlobusAuthContextProps = GlobusAuthState;

const GlobusAuthContext = createContext<GlobusAuthContextProps | undefined>(undefined);
GlobusAuthContext.displayName = "GlobusAuthContext";
export default GlobusAuthContext;
