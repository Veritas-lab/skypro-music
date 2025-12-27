const BASE_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/user/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          data.message || "Пользователь с таким email уже существует"
        );
      }
      throw new Error(data.message || `Ошибка регистрации: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при регистрации");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Неверный email или пароль");
      }
      if (response.status === 400) {
        throw new Error(data.message || "Некорректные данные для входа");
      }
      throw new Error(data.message || `Ошибка входа: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при входе");
  }
};

export const getTokens = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Неверный email или пароль");
      }
      throw new Error(
        data.detail ||
          data.message ||
          `Ошибка получения токена: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при получении токена");
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Токен недействителен или просрочен");
      }
      throw new Error(
        data.detail || `Ошибка обновления токена: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети при обновлении токена");
  }
};
