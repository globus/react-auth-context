import { createContext } from "react";
import type { GlobusAuthState } from "./State";

export type GlobusAuthContextProps = GlobusAuthState;

export default createContext<GlobusAuthContextProps | undefined>(undefined);
