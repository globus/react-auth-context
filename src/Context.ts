import { createContext } from "react";
import type { GlobusAuthState } from "./State";

/**
 * @public
 */
export type GlobusAuthContextProps = GlobusAuthState;

/**
 * @public
 */
export default createContext<GlobusAuthContextProps | undefined>(undefined);
