import type { AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

/**
 * Methods on `AuthorizationManager` that result in an OAuth redirect.
 */
const REDIRECT_METHODS = [
  "login",
  "handleConsentRequiredError",
  "handleAuthorizationRequirementsError",
] as const;

type RedirectMethod = (typeof REDIRECT_METHODS)[number];

const isRedirectMethod = (prop: string | symbol): prop is RedirectMethod =>
  (REDIRECT_METHODS as readonly (string | symbol)[]).includes(prop);

/**
 * Wraps an `AuthorizationManager` so that `onBeforeRedirect` is called
 * immediately before any of `REDIRECT_METHODS` are invoked.
 *
 * A `Proxy` is used (rather than spreading/subclassing) because
 * `AuthorizationManager` relies on private class fields; methods and
 * getters must be invoked with the original instance as `this` in order
 * to access them.
 */
export const wrapAuthorizationWithLifecycle = (
  authorization: AuthorizationManager,
  onBeforeRedirect: () => void,
): AuthorizationManager => {
  return new Proxy(authorization, {
    get(target, prop) {
      const value = Reflect.get(target, prop);
      if (isRedirectMethod(prop) && typeof value === "function") {
        return (...args: unknown[]) => {
          onBeforeRedirect();
          return value.apply(target, args);
        };
      }
      return value;
    },
  });
};
