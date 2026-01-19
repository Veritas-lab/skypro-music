import axios from "axios";
import { BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "../constants";
import {
  TrackTypes,
  SelectionTypes,
  FavoriteOperationResponse,
} from "@/SharedTypes/SharedTypes";

const getAccessToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") || "";
  }
  return "";
};

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

interface TracksApiResponse {
  tracks?: TrackTypes[];
  items?: TrackTypes[];
  data?: TrackTypes[];
  result?: TrackTypes[];
  [key: string]: unknown;
}

interface StandardApiResponse<T> {
  success?: boolean;
  data?: T;
  result?: T;
  message?: string;
}

interface ApiSelectionData {
  _id?: string | number;
  id?: string | number;
  name?: string;
  items?: TrackTypes[];
  tracks?: TrackTypes[];
  data?: TrackTypes[];
  owner?: string;
}

export const getTracks = async (): Promise<TrackTypes[]> => {
  try {
    const response = await axios.get<StandardApiResponse<TrackTypes[]>>(
      `${BASE_URL}${API_ENDPOINTS.ALL_TRACKS}`,
      { headers: DEFAULT_HEADERS }
    );

    let tracks: TrackTypes[] = [];

    if (response.data && Array.isArray(response.data.data)) {
      tracks = response.data.data;
    } else if (Array.isArray(response.data)) {
      tracks = response.data;
    }

    if (tracks.length === 0) {
      return getFallbackTracks();
    }

    return tracks;
  } catch {
    return getFallbackTracks();
  }
};

export const getTrackById = async (id: string): Promise<TrackTypes> => {
  try {
    const response = await axios.get<StandardApiResponse<TrackTypes>>(
      `${BASE_URL}${API_ENDPOINTS.TRACK_BY_ID}${id}/`,
      { headers: DEFAULT_HEADERS }
    );
    
    // По документации API, ответ имеет структуру: { success: true, data: {...} }
    const trackData = response.data?.data || response.data;
    
    // Проверяем, что получили валидные данные трека
    if (!trackData || typeof trackData !== 'object') {
      throw new Error(`Некорректные данные трека ${id}`);
    }
    
    return trackData as TrackTypes;
  } catch (error) {
    console.error(`Error fetching track ${id}:`, error);
    throw new Error(`Не удалось загрузить трек ${id}`);
  }
};

export const getFavoriteTracks = async (): Promise<TrackTypes[]> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Требуется авторизация для просмотра избранных треков");
  }

  try {
    const response = await axios.get<TracksApiResponse | TrackTypes[]>(
      `${BASE_URL}${API_ENDPOINTS.FAVORITE_TRACKS}`,
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${accessToken}`,
        },
      }
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
        if (Array.isArray(arr)) {
          tracks = arr;
          break;
        }
      }
    }

    const validTracks = tracks
      .filter((track) => track && typeof track === "object" && track !== null)
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

    return validTracks;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error("Требуется авторизация для просмотра избранных треков");
      }
    }
    throw new Error("Не удалось загрузить избранные треки");
  }
};

export const addToFavorites = async (
  id: string
): Promise<FavoriteOperationResponse> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Требуется авторизация для добавления в избранное");
  }

  try {
    const response = await axios.post<FavoriteOperationResponse>(
      `${BASE_URL}${API_ENDPOINTS.TRACK_BY_ID}${id}${API_ENDPOINTS.ADD_TO_FAVORITE}`,
      {},
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch {
    throw new Error(`Не удалось добавить трек ${id} в избранное`);
  }
};

export const removeFromFavorites = async (
  id: string
): Promise<FavoriteOperationResponse> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Требуется авторизация для удаления из избранного");
  }

  try {
    const response = await axios.delete<FavoriteOperationResponse>(
      `${BASE_URL}${API_ENDPOINTS.TRACK_BY_ID}${id}${API_ENDPOINTS.REMOVE_FROM_FAVORITE}`,
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch {
    throw new Error(`Не удалось удалить трек ${id} из избранного`);
  }
};

export const getAllSelections = async (): Promise<SelectionTypes[]> => {
  try {
    const response = await axios.get<StandardApiResponse<ApiSelectionData[]>>(
      `${BASE_URL}${API_ENDPOINTS.ALL_SELECTIONS}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    let selectionsData: ApiSelectionData[] = [];

    // По документации API, ответ имеет структуру: { success: true, data: [...] }
    if (Array.isArray(response.data)) {
      selectionsData = response.data;
    } else if (response.data && typeof response.data === "object") {
      const data = response.data as StandardApiResponse<ApiSelectionData[]>;
      if (Array.isArray(data.data)) {
        selectionsData = data.data;
      } else if (Array.isArray(data.result)) {
        selectionsData = data.result;
      }
    }

    return selectionsData.map((selectionData): SelectionTypes => {
      // API возвращает items как массив ID, но для списка всех подборок
      // мы возвращаем пустой массив треков (треки загружаются отдельно по ID подборки)
      const items: TrackTypes[] = [];

      return {
        _id:
          selectionData._id?.toString() || selectionData.id?.toString() || "",
        name: selectionData.name || "Unknown Selection",
        items: items, // Пустой массив, треки загружаются через getSelectionById
        owner: Array.isArray(selectionData.owner) 
          ? String(selectionData.owner[0]) 
          : String(selectionData.owner || "unknown"),
      };
    });
  } catch {
    throw new Error("Не удалось загрузить подборки");
  }
};

export const getSelectionById = async (id: string): Promise<SelectionTypes> => {
  try {
    const response = await axios.get<StandardApiResponse<ApiSelectionData>>(
      `${BASE_URL}${API_ENDPOINTS.SELECTION_BY_ID}${id}/`,
      { headers: DEFAULT_HEADERS }
    );

    let name = `Подборка ${id}`;
    let owner = "unknown";
    let trackIds: (string | number)[] = [];

    // По документации API, ответ имеет структуру: { success: true, data: { _id, name, items, owner } }
    const selectionData = response.data?.data || response.data;

    if (selectionData && typeof selectionData === "object") {
      if ("name" in selectionData && selectionData.name) {
        name = String(selectionData.name);
      }

      if ("owner" in selectionData && selectionData.owner) {
        owner = Array.isArray(selectionData.owner) 
          ? String(selectionData.owner[0]) 
          : String(selectionData.owner);
      }

      // API возвращает items как массив ID треков (чисел)
      if ("items" in selectionData && Array.isArray(selectionData.items)) {
        trackIds = selectionData.items;
      }
    }

    // Загружаем полные данные каждого трека по ID
    const items: TrackTypes[] = [];
    
    if (trackIds.length > 0) {
      // Загружаем треки параллельно для оптимизации
      const trackPromises = trackIds.map(async (trackId) => {
        try {
          return await getTrackById(String(trackId));
        } catch (error) {
          console.error(`Не удалось загрузить трек ${trackId}:`, error);
          return null;
        }
      });

      const loadedTracks = await Promise.all(trackPromises);
      
      // Фильтруем успешно загруженные треки
      items.push(...loadedTracks.filter((track): track is TrackTypes => track !== null));
    }

    return {
      _id: id,
      name,
      items,
      owner,
    };
  } catch (error: unknown) {
    console.error(`Error fetching selection ${id}:`, error);
    throw new Error(`Не удалось загрузить подборку ${id}`);
  }
};

export const createSelection = async (
  name: string,
  items: string[]
): Promise<SelectionTypes> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Требуется авторизация для создания подборки");
  }

  try {
    const response = await axios.post<SelectionTypes>(
      `${BASE_URL}${API_ENDPOINTS.CREATE_SELECTION}`,
      { name, items },
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch {
    throw new Error("Не удалось создать подборку");
  }
};
