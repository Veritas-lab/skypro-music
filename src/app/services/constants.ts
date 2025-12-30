export const BASE_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const API_ENDPOINTS = {
  SIGNUP: "/user/signup/",
  LOGIN: "/user/login/",
  TOKEN: "/user/token/",
  REFRESH_TOKEN: "/user/token/refresh/",

  ALL_TRACKS: "/catalog/track/all/",
  TRACK_BY_ID: "/catalog/track/",
  FAVORITE_TRACKS: "/catalog/track/favorite/all/",
  ADD_TO_FAVORITE: "/favorite/",
  REMOVE_FROM_FAVORITE: "/favorite/",

  ALL_SELECTIONS: "/catalog/selection/all/",
  SELECTION_BY_ID: "/catalog/selection/",
  CREATE_SELECTION: "/catalog/selection/",
};

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export const TOKEN_EXPIRY = {
  ACCESS: 200,
  REFRESH: 7 * 24 * 60 * 60,
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const CUSTOM_SELECTION_NAMES: Record<string, string> = {
  "1": "Плейлист дня",
  "2": "100 танцевальных хитов",
  "3": "Инди-заряд",
};
