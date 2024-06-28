import React from 'react';
import "jest-location-mock";
import '@testing-library/jest-dom'
import { renderHook, waitFor, act, render, screen } from "@testing-library/react";

import { useGlobusAuth } from "../src/useGlobusAuth";
import { createWrapper } from "./shared";
import { type Props, Provider } from "../src/Provider";


const props: Props = {
    client: "dda4edf0-6a95-474d-92e1-9f46040b5d75",
    scopes: "urn:globus:auth:scope:transfer.api.globus.org:all",
    redirect: "https://example.com/callback",
};

describe("Provider", () => {

    it("render", async () => {
        const Component  = () => {
            const { isAuthenticated, authorization } = useGlobusAuth();
            return isAuthenticated ? "AUTHENTICATED" : "NOT AUTHENTICATED";
        }
        await render(
            <Provider {...props}>
                <Component />
            </Provider>
        )
       expect(screen.getByText('NOT AUTHENTICATED')).toBeInTheDocument();
    });



    it("login", async () => {
        const wrapper = createWrapper({ ...props });

        const { result } = renderHook(() => useGlobusAuth(), {
            wrapper,
        });

        await waitFor(() => expect(result.current.isAuthenticated).toBeFalsy());
        await waitFor(() => expect(result.current.authorization).toBeDefined());
        await waitFor(() => expect(result.current.authorization?.user).toBeNull());

        await act(() => result.current.authorization?.login());

        const url = new URL(window.location.href);

        expect(url.hostname).toEqual("auth.globus.org");
        expect(url.pathname).toEqual("/v2/oauth2/authorize");
        expect(url.searchParams.get("client_id")).toEqual(props.client);
        expect(url.searchParams.get("redirect_uri")).toEqual(props.redirect);
        expect(url.searchParams.get("scope")).toEqual("urn:globus:auth:scope:transfer.api.globus.org:all openid profile email offline_access");
    });

    it("allows configuration of the environment", async () => {
        const wrapper = createWrapper({ ...props, environment: "test" });

        const { result } = renderHook(() => useGlobusAuth(), {
            wrapper,
        });

        await waitFor(() => expect(result.current.isAuthenticated).toBeFalsy());
        await waitFor(() => expect(result.current.authorization).toBeDefined());
        await waitFor(() => expect(result.current.authorization?.user).toBeNull());

        await act(() => result.current.authorization?.login());

        const url = new URL(window.location.href);

        expect(url.hostname).toEqual("auth.test.globuscs.info");
    });


});