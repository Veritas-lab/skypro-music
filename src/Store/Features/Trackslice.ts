import { TrackTypes } from "@/SharedTypes/SharedTypes";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToFavorites,
  removeFromFavorites,
  getFavoriteTracks,
} from "@/app/services/tracks/tracksApi";

type initialStateType = {
  currentTrack: TrackTypes | null;
  isPlay: boolean;
  currentPlaylist: TrackTypes[];
  shuffle: boolean;
  repeat: boolean;
  shuffledPlaylist: TrackTypes[];
  currentIndex: number;
  allTracks: TrackTypes[];
  fetchError: null | string;
  fetchIsLoading: boolean;
  favoriteTracks: TrackTypes[];
  favoriteTracksIds: string[];
  filteredFavoriteTracks: TrackTypes[];
  favoriteLoading: boolean;
  favoritesLoaded: boolean;
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  currentPlaylist: [],
  shuffle: false,
  repeat: false,
  shuffledPlaylist: [],
  currentIndex: -1,
  allTracks: [],
  fetchError: null,
  fetchIsLoading: true,
  favoriteTracks: [],
  favoriteTracksIds: [],
  filteredFavoriteTracks: [],
  favoriteLoading: false,
  favoritesLoaded: false,
};

export const toggleFavoriteAPI = createAsyncThunk(
  "tracks/toggleFavoriteAPI",
  async (track: TrackTypes, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as { tracks: initialStateType };
      const isCurrentlyFavorite = state.tracks.favoriteTracksIds.includes(
        track._id.toString()
      );

      dispatch(toggleFavorite(track));

      try {
        if (isCurrentlyFavorite) {
          await removeFromFavorites(track._id.toString());
        } else {
          await addToFavorites(track._id.toString());
        }
        return { success: true, trackId: track._id };
      } catch (error: unknown) {
        dispatch(toggleFavorite(track));
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ошибка при изменении избранного";

        if (
          errorMessage.includes("авторизация") ||
          errorMessage.includes("Сессия истекла")
        ) {
          throw new Error("AUTH_REQUIRED");
        }

        return rejectWithValue(errorMessage);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ошибка при изменении избранного";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadFavoriteTracksAPI = createAsyncThunk(
  "tracks/loadFavoriteTracksAPI",
  async (_, { rejectWithValue }) => {
    try {
      const favoriteTracks = await getFavoriteTracks();
      return favoriteTracks;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ошибка загрузки избранных треков";
      return rejectWithValue(errorMessage);
    }
  }
);

const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackTypes>) => {
      state.currentTrack = action.payload;
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackTypes[]>) => {
      state.currentPlaylist = action.payload;

      if (state.shuffle && action.payload.length > 0) {
        const shuffled = [...action.payload].sort(() => Math.random() - 0.5);
        state.shuffledPlaylist = shuffled;
      }
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
      if (action.payload && state.currentPlaylist.length > 0) {
        const shuffled = [...state.currentPlaylist].sort(
          () => Math.random() - 0.5
        );
        state.shuffledPlaylist = shuffled;
      }
    },
    setRepeat: (state, action: PayloadAction<boolean>) => {
      state.repeat = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    resetCurrentTrack: (state) => {
      state.currentTrack = null;
      state.isPlay = false;
      state.currentIndex = -1;
    },
    nextTrack: (state) => {
      if (state.currentPlaylist.length === 0) return;

      let nextIndex;
      if (state.shuffle && state.shuffledPlaylist.length > 0) {
        const currentIndexInShuffled = state.shuffledPlaylist.findIndex(
          (track) => track._id === state.currentTrack?._id
        );
        nextIndex =
          (currentIndexInShuffled + 1) % state.shuffledPlaylist.length;
        state.currentTrack = state.shuffledPlaylist[nextIndex];
      } else {
        const currentIndex = state.currentPlaylist.findIndex(
          (track) => track._id === state.currentTrack?._id
        );
        nextIndex = (currentIndex + 1) % state.currentPlaylist.length;
        state.currentTrack = state.currentPlaylist[nextIndex];
      }
      state.currentIndex = nextIndex;
    },
    prevTrack: (state) => {
      if (state.currentPlaylist.length === 0) return;

      let prevIndex;
      if (state.shuffle && state.shuffledPlaylist.length > 0) {
        const currentIndexInShuffled = state.shuffledPlaylist.findIndex(
          (track) => track._id === state.currentTrack?._id
        );
        prevIndex =
          currentIndexInShuffled > 0
            ? currentIndexInShuffled - 1
            : state.shuffledPlaylist.length - 1;
        state.currentTrack = state.shuffledPlaylist[prevIndex];
      } else {
        const currentIndex = state.currentPlaylist.findIndex(
          (track) => track._id === state.currentTrack?._id
        );
        prevIndex =
          currentIndex > 0
            ? currentIndex - 1
            : state.currentPlaylist.length - 1;
        state.currentTrack = state.currentPlaylist[prevIndex];
      }
      state.currentIndex = prevIndex;
    },
    setAllTracks: (state, action: PayloadAction<TrackTypes[]>) => {
      state.allTracks = action.payload;
      state.currentPlaylist = action.payload; // Update the current playlist with all tracks
    },
    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },
    setFetchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchIsLoading = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<TrackTypes>) => {
      const track = action.payload;
      const isFavorite = state.favoriteTracksIds.includes(track._id.toString());

      if (isFavorite) {
        state.favoriteTracks = state.favoriteTracks.filter(
          (fav) => fav._id.toString() !== track._id.toString()
        );
        state.favoriteTracksIds = state.favoriteTracksIds.filter(
          (id) => id !== track._id.toString()
        );
      } else {
        state.favoriteTracks.push(track);
        state.favoriteTracksIds.push(track._id.toString());
      }
    },
    addToFavoritesSuccess: (state, action: PayloadAction<TrackTypes>) => {
      const track = action.payload;
      if (
        !state.favoriteTracks.find(
          (fav) => fav._id.toString() === track._id.toString()
        )
      ) {
        state.favoriteTracks.push(track);
        state.favoriteTracksIds.push(track._id.toString());
      }
    },
    removeFromFavoritesSuccess: (
      state,
      action: PayloadAction<string | number>
    ) => {
      const trackId = action.payload.toString(); // Преобразуем в string
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track._id.toString() !== trackId
      );
      state.favoriteTracksIds = state.favoriteTracksIds.filter(
        (id) => id !== trackId
      );
    },
    clearFavorites: (state) => {
      state.favoriteTracks = [];
      state.favoriteTracksIds = [];
      state.filteredFavoriteTracks = [];
      state.favoritesLoaded = false;
      state.favoriteLoading = false;
    },
    clearFavoritesOnLogout: (state) => {
      state.favoriteTracks = [];
      state.favoriteTracksIds = [];
    },
    setFilteredFavoriteTracks: (state, action: PayloadAction<TrackTypes[]>) => {
      state.filteredFavoriteTracks = action.payload;
    },
    setFavoriteTracks: (state, action: PayloadAction<TrackTypes[]>) => {
      if (Array.isArray(action.payload)) {
        state.favoriteTracks = action.payload;
        state.favoriteTracksIds = action.payload.map((track) =>
          track._id.toString()
        );
      } else {
        console.error(
          "setFavoriteTracks: action.payload is not an array",
          action.payload
        );
        state.favoriteTracks = [];
        state.favoriteTracksIds = [];
      }
    },
    setFavoriteLoading: (state, action: PayloadAction<boolean>) => {
      state.favoriteLoading = action.payload;
    },
    setFavoritesLoaded: (state, action: PayloadAction<boolean>) => {
      state.favoritesLoaded = action.payload;
    },
    clearUserHistory: (state) => {
      state.currentTrack = null;
      state.isPlay = false;
      state.currentPlaylist = [];
      state.shuffle = false;
      state.repeat = false;
      state.shuffledPlaylist = [];
      state.currentIndex = -1;
      state.allTracks = [];
      state.favoriteTracks = [];
      state.favoriteTracksIds = [];
      state.filteredFavoriteTracks = [];
      state.favoriteLoading = false;
      state.favoritesLoaded = false;
    },
    syncFavoritesWithAllTracks: (state) => {
      state.allTracks = state.allTracks.map((track: TrackTypes) => ({
        ...track,
        isFavorite: state.favoriteTracksIds.includes(track._id.toString()),
      }));
      state.currentPlaylist = state.currentPlaylist.map(
        (track: TrackTypes) => ({
          ...track,
          isFavorite: state.favoriteTracksIds.includes(track._id.toString()),
        })
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavoriteAPI.pending, (state) => {
        state.favoriteLoading = true;
      })
      .addCase(toggleFavoriteAPI.fulfilled, (state) => {
        state.favoriteLoading = false;
      })
      .addCase(toggleFavoriteAPI.rejected, (state, action) => {
        state.favoriteLoading = false;
        if (action.payload === "AUTH_REQUIRED") {
          state.fetchError = "Требуется авторизация";
        } else if (action.payload) {
          state.fetchError = action.payload as string;
        }
      })
      .addCase(loadFavoriteTracksAPI.pending, (state) => {
        state.favoriteLoading = true;
      })
      .addCase(loadFavoriteTracksAPI.fulfilled, (state, action) => {
        state.favoriteLoading = false;
        state.favoriteTracks = action.payload;
        state.favoriteTracksIds = action.payload.map((track: TrackTypes) =>
          track._id.toString()
        );
        state.favoritesLoaded = true;

        state.allTracks = state.allTracks.map((track: TrackTypes) => ({
          ...track,
          isFavorite: state.favoriteTracksIds.includes(track._id.toString()),
        }));
        state.currentPlaylist = state.currentPlaylist.map(
          (track: TrackTypes) => ({
            ...track,
            isFavorite: state.favoriteTracksIds.includes(track._id.toString()),
          })
        );
      })
      .addCase(loadFavoriteTracksAPI.rejected, (state, action) => {
        state.favoriteLoading = false;
        if (action.payload) {
          state.fetchError = action.payload as string;
        }
      });
  },
});

export const {
  setCurrentTrack,
  setIsPlay,
  setCurrentPlaylist,
  setShuffle,
  setRepeat,
  setCurrentIndex,
  resetCurrentTrack,
  nextTrack,
  prevTrack,
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
  toggleFavorite,
  addToFavoritesSuccess,
  removeFromFavoritesSuccess,
  clearFavorites,
  clearFavoritesOnLogout,
  setFilteredFavoriteTracks,
  setFavoriteTracks,
  setFavoriteLoading,
  setFavoritesLoaded,
  clearUserHistory,
  syncFavoritesWithAllTracks,
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
