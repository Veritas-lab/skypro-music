import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  getTokens,
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

interface LoginResponse {
  user?: User;
  email?: string;
  username?: string;
  _id?: string;
  result?: {
    email: string;
    username: string;
    _id: string;
  };
  [key: string]: unknown;
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

// Вспомогательная функция для извлечения данных пользователя из ответа
const extractUserFromResponse = (response: LoginResponse): User => {
  if (
    response.user &&
    response.user.email &&
    response.user.username &&
    response.user._id
  ) {
    return response.user;
  }

  if (response.email && response.username && response._id) {
    return {
      email: response.email as string,
      username: response.username as string,
      _id: response._id as string,
    };
  }

  if (
    response.result &&
    response.result.email &&
    response.result.username &&
    response.result._id
  ) {
    return response.result;
  }

  throw new Error("Не удалось извлечь данные пользователя из ответа");
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
      const userData = extractUserFromResponse(registerData);

      const tokensData = await getTokens(email, password);

      const payload: AuthResponse = {
        user: userData,
        tokens: tokensData,
      };

      localStorage.setItem("user", JSON.stringify(payload));
      localStorage.setItem("access_token", tokensData.access);
      localStorage.setItem("refresh_token", tokensData.refresh);

      return payload;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Ошибка регистрации");
    }
  }
);

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const loginResponse: LoginResponse = await loginUser(email, password);
    const userData = extractUserFromResponse(loginResponse);

    const tokensData = await getTokens(email, password);

    const payload: AuthResponse = {
      user: userData,
      tokens: tokensData,
    };

    localStorage.setItem("user", JSON.stringify(payload));
    localStorage.setItem("access_token", tokensData.access);
    localStorage.setItem("refresh_token", tokensData.refresh);

    return payload;
  } catch (error) {
    const err = error as Error;
    return rejectWithValue(err.message || "Ошибка входа");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
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
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          const parsed: AuthResponse = JSON.parse(saved);
          state.user = parsed.user;
          state.access = parsed.tokens.access;
          state.refresh = parsed.tokens.refresh;
          state.isAuth = true;
        } catch (error) {
          console.error("Error restoring session:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<TokenResponse>) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
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
        }
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
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка входа";
        state.isAuth = false;
      });
  },
});

export const { logout, restoreSession, clearError, setTokens } =
  authSlice.actions;
export const authSliceReducer = authSlice.reducer;
