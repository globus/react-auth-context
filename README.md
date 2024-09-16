[![npm](https://img.shields.io/npm/v/@globus/react-auth-context?style=flat-square&logo=npm&color=000&label)](https://www.npmjs.com/package/@globus/react-auth-context)

# `@globus/react-auth-context`

A simple React context for managing Globus-related authentication state.


## Usage

```tsx
import React, { useEffect } from "react";
import { Provider, useGlobusAuth } from '@globus/react-auth-context';

const ExampleComponent = () => {
  const { isAuthenticated, authorization } = useGlobusAuth();
    useEffect(() => {
    async function attempt() {
      if (!isAuthenticated) {
        await instance?.handleCodeRedirect({
          shouldReplace: false,
        });
      }
    }
    attempt();
  }, [authorization, authorization?.handleCodeRedirect, isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={async () => await auth.authorization?.revoke()}>Logout</button>
      ) : (
        <button  onClick={async () => await auth.authorization?.login()}>Login</button>
      )}
    </div>
  );
};

/**
 * Your registered Globus Client ID.
 */
const client = '645b6bfb-4195-4010-83f5-a71332bd4761';
/**
 * Scopes required for your application on login.
 */
const scopes = 'urn:globus:auth:scope:transfer.api.globus.org:all';
/**
 * Redirect URL that will complete the OAuth2 flow.
 */
const redirect = '/';

const App = () => (
  <Provider client={client} scopes={scopes} redirect={redirect}>
    <ExampleComponent />
  </Provider>
);
```