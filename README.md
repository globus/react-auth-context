[![npm](https://img.shields.io/npm/v/@globus/react-auth-context?style=flat-square&logo=npm&color=000&label)](https://www.npmjs.com/package/@globus/react-auth-context)

# `@globus/react-auth-context`

A simple React context for managing Globus-related authentication state, built on top of the [@globus/sdk](https://github.com/globus/globus-sdk-javascript).

## Installation

```
npm install --save @globus/sdk @globus/react-auth-context
```

## Usage

The package includes a `<Provider>` that can be configured with a `client`, `scopes`, and `redirect` that will be used to configure an `AuthorizationManager` instance for the context. The `useGlobusAuth` hook can be used to access the authentication state and the `AuthorizationManager` instance.

```tsx
import React, { useEffect } from "react";
import { Provider, useGlobusAuth } from "@globus/react-auth-context";

/**
 * Your registered Globus Client ID.
 */
const client = "645b6bfb-4195-4010-83f5-a71332bd4761";
/**
 * Scopes required for your application on login.
 */
const scopes = "urn:globus:auth:scope:transfer.api.globus.org:all";
/**
 * Redirect URL that will complete the OAuth2 flow, this will also be the location you call `.handleCodeRedirect` from.
 */
const redirect = "/";

const App = () => (
  /**
   * The `Provider` component wraps the application and provides the authentication context.
   */
  <Provider client={client} scopes={scopes} redirect={redirect}>
    <ExampleComponent />
  </Provider>
);

const ExampleComponent = () => {
  /**
   * The `useGlobusAuth` hook provides access to the authentication state and the `AuthorizationManager` instance.
   */
  const { isAuthenticated, authorization } = useGlobusAuth();

  useEffect(() => {
    async function attempt() {
      if (!authorization || isAuthenticated) {
        return;
      }

      await authorization?.handleCodeRedirect({
        shouldReplace: false,
      });
    }
    attempt();
  }, [authorization, authorization?.handleCodeRedirect, isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={async () => await auth.authorization?.revoke()}>
          Logout
        </button>
      ) : (
        <button onClick={async () => await auth.authorization?.login()}>
          Login
        </button>
      )}
    </div>
  );
};
```

## Lifecycle Hooks

`GlobusAuthLifecycleProvider` lets you run your own logic immediately before any OAuth redirect is triggered — via `login()`, `handleConsentRequiredError()`, or `handleAuthorizationRequirementsError()`.

It's a separate, independently placeable provider: it does not replace `Provider`, and can be wrapped around any subtree beneath it. This is useful, for example, if you need to persist some client-side state (e.g., the current route) before the user is redirected away to authenticate.

```tsx
import {
  Provider,
  GlobusAuthLifecycleProvider,
  useGlobusAuth,
} from "@globus/react-auth-context";

const App = () => (
  <Provider client={client} scopes={scopes} redirect={redirect}>
    <GlobusAuthLifecycleProvider
      onBeforeRedirect={() => {
        // Runs immediately before `login`, `handleConsentRequiredError`,
        // or `handleAuthorizationRequirementsError` redirect the user.
        sessionStorage.setItem("returnTo", window.location.pathname);
      }}
    >
      <ExampleComponent />
    </GlobusAuthLifecycleProvider>
  </Provider>
);
```

Any call to `useGlobusAuth().authorization` from within the `GlobusAuthLifecycleProvider`'s subtree will use these hooks transparently — no changes are required to existing consumers of `useGlobusAuth`. If no `GlobusAuthLifecycleProvider` is present (or no `onBeforeRedirect` is provided), `useGlobusAuth` behaves exactly as it does without this provider.

---

- [API Documentation](/docs/globals.md)
