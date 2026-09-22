import React, { useMemo } from "react";

import GlobusAuthLifecycleContext, {
  type LifecycleHandlers,
} from "./LifecycleContext";

export type LifecycleProviderProps =
  React.PropsWithChildren<LifecycleHandlers>;

/**
 * A provider that allows consumers to intercept OAuth redirect-triggering
 * methods (`login`, `handleConsentRequiredError`, `handleAuthorizationRequirementsError`)
 * on the `AuthorizationManager` returned by `useGlobusAuth()`, without prop-drilling
 * a callback through the component tree.
 *
 * This is a separate, independently placeable provider – it does not replace
 * `Provider` and can be placed anywhere below it in the tree.
 */
export const GlobusAuthLifecycleProvider = ({
  onBeforeRedirect,
  children,
}: LifecycleProviderProps): JSX.Element => {
  const value = useMemo<LifecycleHandlers>(
    () => ({ onBeforeRedirect }),
    [onBeforeRedirect],
  );

  return (
    <GlobusAuthLifecycleContext.Provider value={value}>
      {children}
    </GlobusAuthLifecycleContext.Provider>
  );
};
