import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  getTokens,
  refreshToken as refreshTokenApi,
} from "@/app/services/auth/authApi";

export interface User {
  email: string;
  username: string;
  _id: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  loading: boolean;
  error: string | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  access: null,
  refresh: null,
  loading: false,
  error: null,
  isAuth: false,
};

// Типы для данных localStorage
interface StoredUserData {
  user: User;
  tokens: TokenResponse;
}

// Восстановление сессии
const restoreSessionFromStorage = (): Partial<AuthState> => {
  if (typeof window === "undefined") return {};

  try {
    const savedUser = localStorage.getItem("user");
    const savedAccessToken = localStorage.getItem("access_token");
    const savedRefreshToken = localStorage.getItem("refresh_token");

    if (savedUser && savedAccessToken) {
      const parsedUser: StoredUserData = JSON.parse(savedUser);
      return {
        user: parsedUser.user,
        access: savedAccessToken,
        refresh: savedRefreshToken,
        isAuth: true,
      };
    }
  } catch (error) {
    console.error("Error restoring session:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  return {};
};

export const register = createAsyncThunk<
  AuthResponse,
  { email: string; password: string; username: string },
  { rejectValue: string }
>(
  "auth/register",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const registerData = await registerUser(email, password, username);

      // Приводим тип к User
      const userData: User = registerData.result || registerData;

      const tokensData = await getTokens(email, password);

      const payload: AuthResponse = {
        user: userData,
        tokens: tokensData,
      };

      // Сохраняем в localStorage
      localStorage.setItem("user", JSON.stringify(payload));
      localStorage.setItem("access_token", tokensData.access);
      localStorage.setItem("refresh_token", tokensData.refresh);

      return payload;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Ошибка регистрации");
      }
      return rejectWithValue("Неизвестная ошибка регистрации");
    }
  },
);

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userResponse = await loginUser(email, password);
    const userData: User = userResponse;

    const tokensResponse = await getTokens(email, password);
    const tokensData = tokensResponse;

    const payload: AuthResponse = {
      user: userData,
      tokens: tokensData,
    };

    localStorage.setItem("user", JSON.stringify(payload));
    localStorage.setItem("access_token", tokensData.access);
    localStorage.setItem("refresh_token", tokensData.refresh);

    return payload;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Ошибка входа");
    }
    return rejectWithValue("Неизвестная ошибка входа");
  }
});

// Функция для обновления токена
export const refreshTokens = createAsyncThunk(
  "auth/refreshTokens",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const tokenData = await refreshTokenApi(refreshToken);

      // Обновляем токены в localStorage
      localStorage.setItem("access_token", tokenData.access);

      // Если есть новый refresh token, обновляем его
      if (tokenData.refresh) {
        localStorage.setItem("refresh_token", tokenData.refresh);
      }

      // Обновляем данные пользователя в localStorage
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        try {
          const userData: StoredUserData = JSON.parse(userDataString);
          const updatedUser: StoredUserData = {
            ...userData,
            tokens: {
              access: tokenData.access,
              refresh: tokenData.refresh || refreshToken,
            },
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Error updating user data:", e);
        }
      }

      return {
        access: tokenData.access,
        refresh: tokenData.refresh || refreshToken,
      };
    } catch (error) {
      // Если refresh token невалиден, разлогиниваем
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      if (error instanceof Error) {
        return rejectWithValue(error.message || "Token refresh failed");
      }
      return rejectWithValue("Token refresh failed");
    }
  },
);

// Восстанавливаем сессию из localStorage сразу при создании initialState
const restoredSession = restoreSessionFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    ...restoredSession,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuth = false;
      state.error = null;
    },
    restoreSession: (state) => {
      const restored = restoreSessionFromStorage();
      if (restored.user && restored.access) {
        state.user = restored.user;
        state.access = restored.access;
        state.refresh = restored.refresh || null; // Fix: explicitly set null if undefined
        state.isAuth = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<TokenResponse>) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      localStorage.setItem("access_token", action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem("refresh_token", action.payload.refresh);
      }
    },
    setAuthState: (state, action: PayloadAction<{ isAuth: boolean }>) => {
      state.isAuth = action.payload.isAuth;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.access = action.payload.tokens.access;
          state.refresh = action.payload.tokens.refresh;
          state.isAuth = true;
          state.error = null;
        },
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка регистрации";
        state.isAuth = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.access = action.payload.tokens.access;
          state.refresh = action.payload.tokens.refresh;
          state.isAuth = true;
          state.error = null;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка входа";
        state.isAuth = false;
      })
      .addCase(refreshTokens.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.isAuth = true;
      })
      .addCase(refreshTokens.rejected, (state) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.access = null;
        state.refresh = null;
      });
  },
});

export const { logout, restoreSession, clearError, setTokens, setAuthState } =
  authSlice.actions;
export const authSliceReducer = authSlice.reducer;
