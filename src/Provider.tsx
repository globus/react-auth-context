import React, {
  useReducer,
  useEffect,
  useCallback,
} from "react";

import Context from "./Context";
import { initialState } from "./State";
import { reducer } from "./reducer";

import { authorization } from "@globus/sdk";
import type { AuthorizationManagerConfiguration } from "@globus/sdk/core/authorization/AuthorizationManager";

export type Props = React.PropsWithChildren<AuthorizationManagerConfiguration & {
  /**
   * The environment to use for the SDK.
   */
  environment?: string
}>

export const Provider = ({
  environment,
  children,
  ...authorizationManagerConfigruation
}: Props): JSX.Element => {
  if (environment) {
    // @ts-ignore
    globalThis.GLOBUS_SDK_ENVIRONMENT = environment;
  }

  const {
    redirect,
    scopes, 
    client,
    ...config
  } = authorizationManagerConfigruation;

  /**
   * Remove events from the configuration object.
   * 
   * @todo We could probably support dispatching user-provided events
   * in our `handleAuthenticated` and `handleRevoke` functions, it's just
   * not clear if it would be necessary.
   */
  delete config?.events;

  const [state, dispatch] = useReducer(reducer, initialState, (initialArg) => {
    const instance = authorization.create({
      redirect,
      scopes,
      client,
      useRefreshTokens: true,
      ...config,
    });
    return {
      ...initialArg,
      authorization: instance,
      events: instance.events,
      isAuthenticated: instance.authenticated
    }
  });

  const handleAuthenticated = useCallback(({
    isAuthenticated,
  }: {
    isAuthenticated: boolean;
  }) => {
    dispatch({ type: "AUTHENTICATED", payload: isAuthenticated });
  }, []);

  const handleRevoke = useCallback(() => {
    dispatch({ type: "REVOKE" });
  }, []);

  useEffect(() => {
    state.authorization?.events.revoke.addListener(handleRevoke);
    state.authorization?.events.authenticated.addListener(handleAuthenticated);
    return () => {
      state.authorization?.events.revoke.removeListener(handleRevoke);
      state.authorization?.events.authenticated.removeListener(handleAuthenticated);
    };
  }, [state.authorization, handleRevoke, handleAuthenticated]);

  return (
    <Context.Provider
      value={state}
    >
      {children}
    </Context.Provider>
  );
};
