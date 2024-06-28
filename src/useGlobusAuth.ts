import { useContext } from "react";
import Context, { GlobusAuthContextProps } from "./Context";

export const useGlobusAuth = () => {
  const context = useContext(Context);
  return context as unknown as GlobusAuthContextProps;
};
