import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "../constants";
import {
  TrackTypes,
  SelectionTypes,
  FavoriteOperationResponse,
} from "@/SharedTypes/SharedTypes";

interface TracksApiResponse {
  tracks?: TrackTypes[];
  items?: TrackTypes[];
  data?: TrackTypes[];
  result?: TrackTypes[];
  [key: string]: unknown;
}

interface SelectionApiResponse {
  name?: string;
  items?: TrackTypes[];
  tracks?: TrackTypes[];
  data?: TrackTypes[];
  owner?: string;
  [key: string]: unknown;
}

interface ApiErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

// Простая функция для получения access token
const getAccessToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token") || "";
  }
  return "";
};

// Функция для обновления токена при 401 ошибке
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      return null;
    }

    const response = await axios.post<RefreshTokenResponse>(
      `${BASE_URL}/user/token/refresh/`,
      { refresh: refreshToken }
    );

    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      if (response.data.refresh) {
        localStorage.setItem("refresh_token", response.data.refresh);
      }
      return response.data.access;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  return null;
};

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const createApiInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  // Добавляем токен в заголовки
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const apiInstance = createApiInstance();

const getFallbackTracks = (): TrackTypes[] => {
  return [
    {
      _id: 1,
      name: "Chase",
      author: "Alexander Nakarada",
      release_date: "2005-06-11",
      genre: ["Хип-хоп"],
      duration_in_seconds: 128,
      album: "Chase",
      logo: null,
      track_file:
        "https://webdev-music-003b5b991590.herokuapp.com/media/music_files/Alexander_Nakarada_-_Chase.mp3",
      starred_user: [],
    },
  ];
};

export const getTracks = async (): Promise<TrackTypes[]> => {
  try {
    const response = await axios.get<TracksApiResponse | TrackTypes[]>(
      `${BASE_URL}${API_ENDPOINTS.ALL_TRACKS}`,
      { headers: DEFAULT_HEADERS }
    );

    let tracks: TrackTypes[] = [];

    if (Array.isArray(response.data)) {
      tracks = response.data;
    } else if (response.data && typeof response.data === "object") {
      const apiResponse = response.data as TracksApiResponse;

      const possibleArrays = [
        apiResponse.tracks,
        apiResponse.items,
        apiResponse.data,
        apiResponse.result,
      ];

      for (const arr of possibleArrays) {
        if (Array.isArray(arr) && arr.length > 0) {
          tracks = arr;
          break;
        }
      }

      if (tracks.length === 0) {
        const values = Object.values(apiResponse);
        tracks = values.filter(
          (item): item is TrackTypes =>
            typeof item === "object" && item !== null && "name" in item
        );
      }
    }

    const validTracks = tracks
      .filter((track) => track && typeof track === "object")
      .map((track) => ({
        _id: Number(track._id) || Math.floor(Math.random() * 1000000),
        name: track.name || "Unknown Track",
        author: track.author || "Unknown Artist",
        release_date: track.release_date || "2023-01-01",
        genre: Array.isArray(track.genre)
          ? track.genre
          : [track.genre || "Unknown Genre"],
        duration_in_seconds: track.duration_in_seconds || 0,
        album: track.album || "Unknown Album",
        logo: track.logo || null,
        track_file: track.track_file || "",
        starred_user: track.starred_user || [],
      }));

    return validTracks.length > 0 ? validTracks : getFallbackTracks();
  } catch {
    return getFallbackTracks();
  }
};

export const getTrackById = async (id: string): Promise<TrackTypes> => {
  try {
    const response = await axios.get<TrackTypes>(
      `${BASE_URL}${API_ENDPOINTS.TRACK_BY_ID}${id}/`,
      { headers: DEFAULT_HEADERS }
    );
    return response.data;
  } catch {
    throw new Error(`Не удалось загрузить трек ${id}`);
  }
};

interface FavoriteTracksResponse {
  tracks?: TrackTypes[];
  items?: TrackTypes[];
  data?: TrackTypes[];
  result?: TrackTypes[];
  [key: string]: unknown;
}

export const getFavoriteTracks = async (): Promise<TrackTypes[]> => {
  try {
    const response = await apiInstance.get<
      FavoriteTracksResponse | TrackTypes[]
    >(API_ENDPOINTS.FAVORITE_TRACKS);

    let tracksArray: TrackTypes[] = [];

    if (Array.isArray(response.data)) {
      tracksArray = response.data;
    } else if (response.data && typeof response.data === "object") {
      const apiResponse = response.data as FavoriteTracksResponse;

      const possibleArrays = [
        apiResponse.tracks,
        apiResponse.items,
        apiResponse.data,
        apiResponse.result,
      ];

      for (const arr of possibleArrays) {
        if (Array.isArray(arr) && arr.length > 0) {
          tracksArray = arr;
          break;
        }
      }

      if (tracksArray.length === 0) {
        const values = Object.values(apiResponse);
        tracksArray = values.filter(
          (item): item is TrackTypes =>
            typeof item === "object" && item !== null && "name" in item
        );
      }
    }

    return tracksArray;
  } catch (error) {
    let errorMessage = "Не удалось загрузить избранные треки";

    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error("AUTH_REQUIRED");
      }

      const apiError = error.response?.data as ApiErrorResponse;
      errorMessage = apiError?.detail || apiError?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (
      errorMessage.includes("авторизация") ||
      errorMessage.includes("Сессия истекла")
    ) {
      throw new Error("AUTH_REQUIRED");
    }

    throw new Error(errorMessage);
  }
};

export const addToFavorites = async (
  id: string
): Promise<FavoriteOperationResponse> => {
  try {
    const response = await apiInstance.post<FavoriteOperationResponse>(
      `${API_ENDPOINTS.TRACK_BY_ID}${id}${API_ENDPOINTS.ADD_TO_FAVORITE}`,
      {}
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }
    throw new Error(`Не удалось добавить трек ${id} в избранное`);
  }
};

export const removeFromFavorites = async (
  id: string
): Promise<FavoriteOperationResponse> => {
  try {
    const response = await apiInstance.delete<FavoriteOperationResponse>(
      `${API_ENDPOINTS.TRACK_BY_ID}${id}${API_ENDPOINTS.REMOVE_FROM_FAVORITE}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }
    throw new Error(`Не удалось удалить трек ${id} из избранного`);
  }
};

export const getAllSelections = async (): Promise<SelectionTypes[]> => {
  try {
    const response = await axios.get<SelectionTypes[]>(
      `${BASE_URL}${API_ENDPOINTS.ALL_SELECTIONS}`,
      { headers: DEFAULT_HEADERS }
    );
    return response.data;
  } catch {
    throw new Error("Не удалось загрузить подборки");
  }
};

export const getSelectionById = async (id: string): Promise<SelectionTypes> => {
  try {
    const response = await axios.get<SelectionApiResponse | TrackTypes[]>(
      `${BASE_URL}${API_ENDPOINTS.SELECTION_BY_ID}${id}/`,
      { headers: DEFAULT_HEADERS }
    );

    let items: TrackTypes[] = [];
    let selectionName = `Подборка ${id}`;
    let owner = "unknown";

    if (Array.isArray(response.data)) {
      items = response.data;
    } else if (response.data && typeof response.data === "object") {
      const apiResponse = response.data as SelectionApiResponse;

      if (Array.isArray(apiResponse.items)) {
        items = apiResponse.items;
      } else if (Array.isArray(apiResponse.tracks)) {
        items = apiResponse.tracks;
      } else if (Array.isArray(apiResponse.data)) {
        items = apiResponse.data;
      } else {
        const values = Object.values(apiResponse);
        items = values.filter(
          (item): item is TrackTypes =>
            typeof item === "object" && item !== null && "name" in item
        );
      }

      if (apiResponse.name) {
        selectionName = apiResponse.name;
      }
      if (apiResponse.owner) {
        owner = apiResponse.owner;
      }
    }

    return {
      _id: id,
      name: selectionName,
      items: items,
      owner: owner,
    };
  } catch {
    throw new Error(`Не удалось загрузить подборку ${id}`);
  }
};

export const createSelection = async (
  name: string,
  items: string[]
): Promise<SelectionTypes> => {
  try {
    const response = await apiInstance.post<SelectionTypes>(
      API_ENDPOINTS.CREATE_SELECTION,
      { name, items }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }
    throw new Error("Не удалось создать подборку");
  }
};
