import { createContext } from "react";

export type LifecycleHandlers = {
  /**
   * Called immediately before any OAuth redirect-triggering method
   * (`login`, `handleConsentRequiredError`, `handleAuthorizationRequirementsError`)
   * is invoked on the `AuthorizationManager` returned by `useGlobusAuth()`.
   */
  onBeforeRedirect?: () => void;
};

const GlobusAuthLifecycleContext = createContext<LifecycleHandlers>({});
GlobusAuthLifecycleContext.displayName = "GlobusAuthLifecycleContext";

export default GlobusAuthLifecycleContext;
