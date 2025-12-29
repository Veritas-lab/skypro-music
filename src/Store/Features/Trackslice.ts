// Store/Features/Trackslice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TrackTypes } from "@/SharedTypes/SharedTypes";
import { RootState } from "@/Store/store";

interface TrackState {
  tracks: TrackTypes[];
  currentTrack: TrackTypes | null;
  currentIndex: number;
  isPlay: boolean;
  shuffle: boolean;
  repeat: boolean;
  favoriteTracksIds: string[];
  favoriteTracks: TrackTypes[];
  favoriteLoading: boolean;
  error: string | null;
  loading: boolean;
  currentPlaylist: TrackTypes[];
  filteredFavoriteTracks: TrackTypes[];
}

const initialState: TrackState = {
  tracks: [],
  currentTrack: null,
  currentIndex: -1,
  isPlay: false,
  shuffle: false,
  repeat: false,
  favoriteTracksIds: [],
  favoriteTracks: [],
  favoriteLoading: false,
  error: null,
  loading: false,
  currentPlaylist: [],
  filteredFavoriteTracks: [],
};

export const loadFavoriteTracks = createAsyncThunk(
  "tracks/loadFavoriteTracks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.access; // Изменено с token на access

      if (!token) {
        return rejectWithValue("Требуется авторизация");
      }

      const response = await axios.get(
        "https://webdev-music-003b5b9a7b78.herokuapp.com/favorite/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return rejectWithValue("Требуется авторизация");
      }
      return rejectWithValue("Ошибка загрузки избранных треков");
    }
  },
);

export const toggleFavoriteAPI = createAsyncThunk(
  "tracks/toggleFavoriteAPI",
  async (track: TrackTypes, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.access; // Изменено с token на access

      if (!token) {
        return rejectWithValue("Требуется авторизация");
      }

      const trackId = track._id.toString();
      const isFavorite = state.tracks.favoriteTracksIds.includes(trackId);

      if (isFavorite) {
        await axios.delete(
          `https://webdev-music-003b5b9a7b78.herokuapp.com/favorite/${track._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return { trackId, action: "remove" } as const;
      } else {
        await axios.post(
          "https://webdev-music-003b5b9a7b78.herokuapp.com/favorite/add",
          { id: track._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return { trackId, action: "add" } as const;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return rejectWithValue("Требуется авторизация");
      }
      return rejectWithValue("Ошибка при изменении избранного");
    }
  },
);

const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<TrackTypes[]>) => {
      state.tracks = action.payload;
    },

    setCurrentPlaylist: (state, action: PayloadAction<TrackTypes[]>) => {
      state.currentPlaylist = action.payload;
    },

    setCurrentTrack: (state, action: PayloadAction<TrackTypes>) => {
      state.currentTrack = action.payload;
      const index = state.tracks.findIndex(
        (track) => track._id === action.payload._id,
      );
      if (index !== -1) {
        state.currentIndex = index;
      }
    },

    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      if (state.tracks[action.payload]) {
        state.currentTrack = state.tracks[action.payload];
      }
    },

    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },

    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
    },

    setRepeat: (state, action: PayloadAction<boolean>) => {
      state.repeat = action.payload;
    },

    toggleFavorite: (state, action: PayloadAction<TrackTypes>) => {
      const trackId = action.payload._id.toString();
      const index = state.favoriteTracksIds.indexOf(trackId);

      if (index === -1) {
        state.favoriteTracksIds.push(trackId);
      } else {
        state.favoriteTracksIds.splice(index, 1);
      }
    },

    nextTrack: (state) => {
      if (state.tracks.length === 0) return;

      const nextIndex = (state.currentIndex + 1) % state.tracks.length;
      state.currentIndex = nextIndex;
      state.currentTrack = state.tracks[nextIndex];
    },

    prevTrack: (state) => {
      if (state.tracks.length === 0) return;

      const prevIndex =
        state.currentIndex <= 0
          ? state.tracks.length - 1
          : state.currentIndex - 1;
      state.currentIndex = prevIndex;
      state.currentTrack = state.tracks[prevIndex];
    },

    setFilteredFavoriteTracks: (state, action: PayloadAction<TrackTypes[]>) => {
      state.filteredFavoriteTracks = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavoriteTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavoriteTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteTracks = action.payload;
        state.favoriteTracksIds = action.payload.map((track: TrackTypes) =>
          track._id.toString(),
        );
      })
      .addCase(loadFavoriteTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleFavoriteAPI.pending, (state) => {
        state.favoriteLoading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteAPI.fulfilled, (state, action) => {
        state.favoriteLoading = false;
        const { trackId, action: favAction } = action.payload;

        if (favAction === "add") {
          if (!state.favoriteTracksIds.includes(trackId)) {
            state.favoriteTracksIds.push(trackId);
          }
        } else if (favAction === "remove") {
          const index = state.favoriteTracksIds.indexOf(trackId);
          if (index !== -1) {
            state.favoriteTracksIds.splice(index, 1);
          }
        }
      })
      .addCase(toggleFavoriteAPI.rejected, (state, action) => {
        state.favoriteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTracks,
  setCurrentPlaylist,
  setCurrentTrack,
  setCurrentIndex,
  setIsPlay,
  setShuffle,
  setRepeat,
  toggleFavorite,
  nextTrack,
  prevTrack,
  setFilteredFavoriteTracks,
  clearError,
} = tracksSlice.actions;

export default tracksSlice.reducer;
