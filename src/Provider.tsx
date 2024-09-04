import React, {
  useState,
  useReducer,
  useEffect,
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const [instance, setInstance] = useState<
    ReturnType<typeof authorization.create>
  >();
  
  const handleAuthenticated = ({
    isAuthenticated,
  }: {
    isAuthenticated: boolean;
  }) => {
    dispatch({ type: "AUTHENTICATED", payload: isAuthenticated });
  };

  const handleRevoke = () => {
    dispatch({ type: "REVOKE" });
  };


  const {
    redirect,
    scopes, 
    client
  } = authorizationManagerConfigruation;

  useEffect(() => {
    const i = authorization.create({
      redirect,
      scopes,
      client,
      useRefreshTokens: true,
      events: {
        authenticated: handleAuthenticated,
        revoke: handleRevoke,
      },
    });

    setInstance(i);

    return () => {
      i.events.revoke.removeListener(handleRevoke);
      i.events.authenticated.removeListener(handleAuthenticated);
    };
  }, [redirect, scopes, client]);

  return (
    <Context.Provider
      value={{
        ...state,
        authorization: instance,
        events: instance?.events,
      }}
    >
      {children}
    </Context.Provider>
  );
};
