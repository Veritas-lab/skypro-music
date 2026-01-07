import { TrackTypes } from "@/SharedTypes/SharedTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { data } from "@/data";

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
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  currentPlaylist: data,
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
};

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
      state.currentPlaylist = action.payload;
    },
    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },
    setFetchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchIsLoading = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<TrackTypes>) => {
      const track = action.payload;
      if (
        !state.favoriteTracks.find(
          (fav) => fav._id.toString() === track._id.toString()
        )
      ) {
        state.favoriteTracks.push(track);
        state.favoriteTracksIds.push(track._id.toString());

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "favoriteTracks",
            JSON.stringify(state.favoriteTracks)
          );
          localStorage.setItem(
            "favoriteTracksIds",
            JSON.stringify(state.favoriteTracksIds)
          );
        }
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string | number>) => {
      const trackId = action.payload;
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track._id.toString() !== trackId.toString()
      );
      state.favoriteTracksIds = state.favoriteTracksIds.filter(
        (id) => id !== trackId.toString()
      );

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "favoriteTracks",
          JSON.stringify(state.favoriteTracks)
        );
        localStorage.setItem(
          "favoriteTracksIds",
          JSON.stringify(state.favoriteTracksIds)
        );
      }
    },
    loadFavoriteTracks: (state) => {
      if (typeof window !== "undefined") {
        try {
          const savedFavorites = localStorage.getItem("favoriteTracks");
          const savedIds = localStorage.getItem("favoriteTracksIds");

          if (savedFavorites) {
            state.favoriteTracks = JSON.parse(savedFavorites);
          }
          if (savedIds) {
            state.favoriteTracksIds = JSON.parse(savedIds);
          }
        } catch (error) {
          console.error(
            "Error loading favorite tracks from localStorage:",
            error
          );
        }
      }
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
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "favoriteTracks",
          JSON.stringify(state.favoriteTracks)
        );
        localStorage.setItem(
          "favoriteTracksIds",
          JSON.stringify(state.favoriteTracksIds)
        );
      }
    },

    setFilteredFavoriteTracks: (state, action: PayloadAction<TrackTypes[]>) => {
      state.filteredFavoriteTracks = action.payload;
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlay,
  setCurrentPlaylist,
  setShuffle,
  setRepeat,
  setCurrentIndex,
  nextTrack,
  prevTrack,
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
  addToFavorites,
  removeFromFavorites,
  loadFavoriteTracks,
  toggleFavorite,
  setFilteredFavoriteTracks,
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
