import { renderHook, waitFor } from "@testing-library/react";

import { useGlobusAuth } from "../src/useGlobusAuth";
import { createWrapper } from "./shared";

describe("useAuth", () => {
    it("should provide the auth context", async () => {
        const wrapper = createWrapper({ 
            client: "client_id",
            redirect: "https://redirect.uri",
            scopes: "scope"
         });
        const { result } = renderHook(() => useGlobusAuth(), { wrapper });

        await waitFor(() => expect(result.current).toBeDefined());
    });

    it("should return undefined with no provider", async () => {
        const { result } = renderHook(() => useGlobusAuth());
        expect(result.current).toBeUndefined();
    });
});