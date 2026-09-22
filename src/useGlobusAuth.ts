import { useContext, useMemo } from "react";
import Context, { type GlobusAuthContextProps } from "./Context";
import GlobusAuthLifecycleContext from "./LifecycleContext";
import { wrapAuthorizationWithLifecycle } from "./wrapAuthorizationWithLifecycle";

export const useGlobusAuth = (): GlobusAuthContextProps => {
  const context = useContext(Context);
  const { onBeforeRedirect } = useContext(GlobusAuthLifecycleContext);

  const authorization = context?.authorization;

  const wrappedAuthorization = useMemo(() => {
    if (!authorization || !onBeforeRedirect) {
      return authorization;
    }
    return wrapAuthorizationWithLifecycle(authorization, onBeforeRedirect);
  }, [authorization, onBeforeRedirect]);

  const result = useMemo(() => {
    if (!context || wrappedAuthorization === context.authorization) {
      return context;
    }
    return { ...context, authorization: wrappedAuthorization };
  }, [context, wrappedAuthorization]);

  if (!context) {
    console.warn('No context found for Globus Auth, please ensure useGlobusAuth() is being used in a child of a provider component.')
  }
  return result as unknown as GlobusAuthContextProps;
};
