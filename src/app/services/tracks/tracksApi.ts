import axios from "axios";
import { BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "../constants";
import {
  TrackTypes,
  SelectionTypes,
  FavoriteOperationResponse,
} from "@/SharedTypes/Shared.Types";

const getAccessToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token") || "";
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

interface SelectionApiResponse {
  name?: string;
  items?: TrackTypes[];
  tracks?: TrackTypes[];
  data?: TrackTypes[];
  owner?: string;
  [key: string]: unknown;
}

export const getTracks = async (): Promise<TrackTypes[]> => {
  try {
    const response = await axios.get<TracksApiResponse | TrackTypes[]>(
      `${BASE_URL}${API_ENDPOINTS.ALL_TRACKS}`,
      { headers: DEFAULT_HEADERS },
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
            typeof item === "object" && item !== null && "name" in item,
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
      { headers: DEFAULT_HEADERS },
    );
    return response.data;
  } catch {
    throw new Error(`Не удалось загрузить трек ${id}`);
  }
};

export const getFavoriteTracks = async (): Promise<TrackTypes[]> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Требуется авторизация для просмотра избранных треков");
  }

  try {
    const response = await axios.get<TrackTypes[]>(
      `${BASE_URL}${API_ENDPOINTS.FAVORITE_TRACKS}`,
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch {
    throw new Error("Не удалось загрузить избранные треки");
  }
};

export const addToFavorites = async (
  id: string,
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
      },
    );
    return response.data;
  } catch {
    throw new Error(`Не удалось добавить трек ${id} в избранное`);
  }
};

export const removeFromFavorites = async (
  id: string,
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
      },
    );
    return response.data;
  } catch {
    throw new Error(`Не удалось удалить трек ${id} из избранного`);
  }
};

export const getAllSelections = async (): Promise<SelectionTypes[]> => {
  try {
    const response = await axios.get<SelectionTypes[]>(
      `${BASE_URL}${API_ENDPOINTS.ALL_SELECTIONS}`,
      { headers: DEFAULT_HEADERS },
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
      { headers: DEFAULT_HEADERS },
    );

    let items: TrackTypes[] = [];

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
            typeof item === "object" && item !== null && "name" in item,
        );
      }
    }

    return {
      _id: id,
      name: (response.data as SelectionApiResponse)?.name || `Подборка ${id}`,
      items: items,
      owner: (response.data as SelectionApiResponse)?.owner || "unknown",
    };
  } catch {
    throw new Error(`Не удалось загрузить подборку ${id}`);
  }
};

export const createSelection = async (
  name: string,
  items: string[],
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
      },
    );
    return response.data;
  } catch {
    throw new Error("Не удалось создать подборку");
  }
};
