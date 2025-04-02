import { useContext } from "react";
import Context, { type GlobusAuthContextProps } from "./Context";

export const useGlobusAuth = (): GlobusAuthContextProps => {
  const context = useContext(Context);
  if (!context) {
    console.warn('No context found for Globus Auth, please ensure useGlobusAuth() is being used in a child of a provider component.')
  }
  return context as unknown as GlobusAuthContextProps;
};
