import { authSliceReducer, logout, clearError, setTokens } from "../authSlice";

describe("authSlice", () => {
  const initialState = {
    user: null,
    access: null,
    refresh: null,
    loading: false,
    error: null,
    isAuth: false,
  };

  it("должен возвращать начальное состояние", () => {
    const state = authSliceReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("должен обрабатывать logout", () => {
    const loggedInState = {
      user: { email: "test@test.com", username: "test", _id: "1" },
      access: "token",
      refresh: "refresh",
      loading: false,
      error: null,
      isAuth: true,
    };

    const state = authSliceReducer(loggedInState, logout());
    expect(state).toEqual(initialState);
  });

  it("должен очищать ошибку", () => {
    const errorState = {
      ...initialState,
      error: "Some error",
    };

    const state = authSliceReducer(errorState, clearError());
    expect(state.error).toBeNull();
  });

  it("должен устанавливать токены", () => {
    const tokens = { access: "new-access", refresh: "new-refresh" };
    const state = authSliceReducer(initialState, setTokens(tokens));

    expect(state.access).toBe("new-access");
    expect(state.refresh).toBe("new-refresh");
  });
});
