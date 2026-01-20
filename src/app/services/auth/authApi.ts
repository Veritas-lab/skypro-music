const BASE_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  tokens?: TokenResponse;
  [key: string]: unknown;
}

interface ApiError extends Error {
  message: string;
  status?: number;
}

let currentTokens: TokenResponse | null = null;

export const setTokens = (tokens: TokenResponse): void => {
  currentTokens = tokens;
  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);
};

export const getAccessToken = (): string | null => {
  return currentTokens?.access || localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return currentTokens?.refresh || localStorage.getItem("refreshToken");
};

export const clearTokens = (): void => {
  currentTokens = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const withReAuth = async <T>(
  apiCall: (accessToken: string) => Promise<T>,
  maxRetries: number = 1,
): Promise<T> => {
  let retryCount = 0;

  const executeWithToken = async (): Promise<T> => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      const error: ApiError = new Error("Токен доступа отсутствует");
      error.status = 401;
      throw error;
    }

    try {
      return await apiCall(accessToken);
    } catch (error: unknown) {
      // Проверяем, является ли ошибка 401 (Unauthorized)
      const isUnauthorized =
        error instanceof Error &&
        (error.message.includes("401") || (error as ApiError).status === 401);

      if (isUnauthorized && retryCount < maxRetries) {
        retryCount++;

        try {
          // Получаем новый access токен
          const refresh = getRefreshToken();
          if (!refresh) {
            const refreshError: ApiError = new Error(
              "Refresh токен отсутствует",
            );
            refreshError.status = 401;
            throw refreshError;
          }

          // По документации API, refresh endpoint возвращает только новый access токен
          const newAccessToken = await refreshToken(refresh);
          
          // Обновляем только access токен, refresh остается прежним
          const newTokens: TokenResponse = {
            access: newAccessToken,
            refresh: refresh, // Сохраняем старый refresh токен
          };
          setTokens(newTokens);

          // Повторяем запрос с новым токеном
          return await executeWithToken();
        } catch {
          // Если не удалось обновить токен, очищаем и выбрасываем ошибку
          clearTokens();
          const sessionError: ApiError = new Error(
            "Сессия истекла. Пожалуйста, войдите снова.",
          );
          sessionError.status = 401;
          throw sessionError;
        }
      }

      throw error;
    }
  };

  return executeWithToken();
};

const createApiError = (message: string, status?: number): ApiError => {
  const error: ApiError = new Error(message);
  if (status) error.status = status;
  return error;
};

export const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  return withReAuth(async (accessToken: string) => {
    const authOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, authOptions);
    const data: unknown = await response.json();

    if (!response.ok) {
      const errorData = data as { message?: string; detail?: string };
      const errorMessage =
        errorData.detail || errorData.message || "Ошибка запроса";
      throw createApiError(
        `HTTP ${response.status}: ${errorMessage}`,
        response.status,
      );
    }

    return data as T;
  });
};

export const registerUser = async (
  email: string,
  password: string,
  username: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/user/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        throw createApiError(
          (data.message as string) ||
            "Пользователь с таким email уже существует",
          response.status,
        );
      }
      throw createApiError(
        (data.message as string) || `Ошибка регистрации: ${response.status}`,
        response.status,
      );
    }

    // По документации API, регистрация НЕ возвращает токены
    // Токены нужно получать отдельным запросом через getTokens()
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при регистрации");
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/user/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw createApiError("Неверный email или пароль", response.status);
      }
      if (response.status === 400) {
        throw createApiError(
          (data.message as string) || "Некорректные данные для входа",
          response.status,
        );
      }
      throw createApiError(
        (data.message as string) || `Ошибка входа: ${response.status}`,
        response.status,
      );
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при входе");
  }
};

export const getTokens = async (
  email: string,
  password: string,
): Promise<TokenResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/user/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: TokenResponse & { detail?: string; message?: string } =
      await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw createApiError("Неверный email или пароль", response.status);
      }
      throw createApiError(
        data.detail ||
          data.message ||
          `Ошибка получения токена: ${response.status}`,
        response.status,
      );
    }

    // Сохраняем токены
    setTokens(data);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при получении токена");
  }
};

export const refreshToken = async (
  refreshToken: string,
): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/user/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data: { access: string; detail?: string } = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw createApiError(
          "Токен недействителен или просрочен",
          response.status,
        );
      }
      throw createApiError(
        data.detail || `Ошибка обновления токена: ${response.status}`,
        response.status,
      );
    }

    // По документации API, refresh endpoint возвращает только новый access токен
    return data.access;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при обновлении токена");
  }
};

export const logoutUser = (): void => {
  clearTokens();
};

export const createAuthenticatedRequest = <T>(
  url: string,
  method: string = "GET",
  body?: unknown,
): Promise<T> => {
  return fetchWithAuth<T>(`${BASE_URL}${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
};

export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export const makeAuthenticatedRequest = <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = "GET", body, headers = {} } = options;

  return fetchWithAuth<T>(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};
