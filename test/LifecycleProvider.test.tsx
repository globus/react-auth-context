import React, { useEffect } from "react";
import "jest-location-mock";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { Provider, type Props } from "../src/Provider";
import { useGlobusAuth } from "../src/useGlobusAuth";
import { GlobusAuthLifecycleProvider } from "../src/LifecycleProvider";

const props: Props = {
  client: "dda4edf0-6a95-474d-92e1-9f46040b5d75",
  scopes: "urn:globus:auth:scope:transfer.api.globus.org:all",
  redirect: "https://example.com/callback",
};

/**
 * Renders outside of any `GlobusAuthLifecycleProvider`, giving the test
 * access to the raw (unwrapped) `AuthorizationManager` instance so its
 * redirect-triggering methods can be stubbed.
 */
function CaptureRawAuthorization({
  onReady,
}: {
  onReady: (authorization: NonNullable<ReturnType<typeof useGlobusAuth>["authorization"]>) => void;
}) {
  const { authorization } = useGlobusAuth();
  useEffect(() => {
    if (authorization) {
      onReady(authorization);
    }
  }, [authorization, onReady]);
  return null;
}

function TriggerConsentRequiredError() {
  const { authorization } = useGlobusAuth();
  return (
    <button
      onClick={() =>
        authorization?.handleConsentRequiredError({
          code: "ConsentRequired",
          required_scopes: [],
        })
      }
    >
      trigger-consent-required
    </button>
  );
}

describe("GlobusAuthLifecycleProvider", () => {
  it("calls onBeforeRedirect before handleConsentRequiredError when placed inside the provider", async () => {
    const order: string[] = [];
    const onBeforeRedirect = jest.fn(() => order.push("onBeforeRedirect"));
    let rawAuthorization: ReturnType<typeof useGlobusAuth>["authorization"];

    render(
      <Provider {...props}>
        <CaptureRawAuthorization
          onReady={(authorization) => {
            rawAuthorization = authorization;
          }}
        />
        <GlobusAuthLifecycleProvider onBeforeRedirect={onBeforeRedirect}>
          <TriggerConsentRequiredError />
        </GlobusAuthLifecycleProvider>
      </Provider>,
    );

    await waitFor(() => expect(rawAuthorization).toBeDefined());

    // Stub the real method on the underlying instance so we can observe
    // the order in which it is called relative to `onBeforeRedirect`.
    rawAuthorization!.handleConsentRequiredError = jest.fn(() => {
      order.push("handleConsentRequiredError");
      return Promise.resolve();
    });

    fireEvent.click(screen.getByText("trigger-consent-required"));

    await waitFor(() =>
      expect(order).toEqual(["onBeforeRedirect", "handleConsentRequiredError"]),
    );
    expect(onBeforeRedirect).toHaveBeenCalledTimes(1);
  });

  it("does not call onBeforeRedirect when used outside of the provider", async () => {
    const onBeforeRedirect = jest.fn();
    let rawAuthorization: ReturnType<typeof useGlobusAuth>["authorization"];

    render(
      <Provider {...props}>
        <CaptureRawAuthorization
          onReady={(authorization) => {
            rawAuthorization = authorization;
          }}
        />
        <TriggerConsentRequiredError />
      </Provider>,
    );

    await waitFor(() => expect(rawAuthorization).toBeDefined());

    const handleConsentRequiredError = jest.fn(() => Promise.resolve());
    rawAuthorization!.handleConsentRequiredError = handleConsentRequiredError;

    fireEvent.click(screen.getByText("trigger-consent-required"));

    await waitFor(() => expect(handleConsentRequiredError).toHaveBeenCalledTimes(1));
    expect(onBeforeRedirect).not.toHaveBeenCalled();
  });
});
