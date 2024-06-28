import { reducer } from "../src/reducer";
import { initialState } from "../src/State";

describe("reducer", () => {

  it("should handle AUTHENTICATED", () => {
    expect(
      reducer(initialState, { type: "AUTHENTICATED", payload: true }),
    ).toHaveProperty('isAuthenticated', true);
  });

  it("should handle REVOKE", () => {
    expect(
      reducer({ ...initialState, isAuthenticated: true }, { type: "REVOKE" }),
    ).toHaveProperty('isAuthenticated', false);
  });

});
