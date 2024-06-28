import React, {
  useState,
  useReducer,
  useEffect,
} from "react";

import Context from "./Context";
import { initialState } from "./State";
import { reducer } from "./reducer";

import { authorization } from "@globus/sdk";
import type { AuthorizationManagerConfiguration } from "@globus/sdk/esm/lib/core/authorization/AuthorizationManager";


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
    ReturnType<typeof authorization.create> | undefined
  >(undefined);
  
  useEffect(() => {
    const i = authorization.create({
      useRefreshTokens: true,
      ...authorizationManagerConfigruation
    });
    setInstance(i);
  }, []);

  /**
   * Register event listeners for the authorization instance.
   */
  useEffect(() => {
    if (!instance) return;

    const handleRevoke = () => {
      dispatch({ type: "REVOKE" });
    };

    instance.events.revoke.addListener(handleRevoke);

    const handleAuthenticated = ({
      isAuthenticated,
    }: {
      isAuthenticated: boolean;
    }) => {
      dispatch({ type: "AUTHENTICATED", payload: isAuthenticated });
    };
    instance.events.authenticated.addListener(handleAuthenticated);

    return () => {
      instance.events.revoke.removeListener(handleRevoke);
      instance.events.authenticated.removeListener(handleAuthenticated);
    };
  }, [instance]);

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
