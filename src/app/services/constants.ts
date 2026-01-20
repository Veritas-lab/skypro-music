export const BASE_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const API_ENDPOINTS = {
  SIGNUP: "/user/signup/",
  LOGIN: "/user/login/",
  TOKEN: "/user/token/",
  refreshToken: "/user/token/refresh/",

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
  accessToken: "accessToken",
  refreshToken: "refreshToken",
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
