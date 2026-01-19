import {
  trackSliceReducer,
  setCurrentTrack,
  setIsPlay,
  setCurrentPlaylist,
  toggleFavorite,
  setFavoriteTracks,
  clearFavorites,
} from "../Trackslice";
import { TrackTypes } from "@/SharedTypes/SharedTypes";

describe("trackSlice", () => {
  const mockTrack: TrackTypes = {
    _id: 1,
    name: "Тестовый трек",
    author: "Тестовый артист",
    release_date: "2023-01-01",
    genre: ["Поп"],
    duration_in_seconds: 180,
    album: "Тестовый альбом",
    logo: null,
    track_file: "test.mp3",
    starred_user: [],
  };

  const mockTrack2: TrackTypes = {
    _id: 2,
    name: "Тестовый трек 2",
    author: "Тестовый артист 2",
    release_date: "2023-01-02",
    genre: ["Рок"],
    duration_in_seconds: 200,
    album: "Тестовый альбом 2",
    logo: null,
    track_file: "test2.mp3",
    starred_user: [],
  };

  it("должен возвращать начальное состояние", () => {
    const state = trackSliceReducer(undefined, { type: "unknown" });
    expect(state.currentTrack).toBeNull();
    expect(state.isPlay).toBe(false);
    expect(state.favoriteTracks).toEqual([]);
    expect(state.favoriteTracksIds).toEqual([]);
    expect(state.favoritesLoaded).toBe(false);
  });

  it("должен устанавливать текущий трек", () => {
    const state = trackSliceReducer(undefined, setCurrentTrack(mockTrack));
    expect(state.currentTrack).toEqual(mockTrack);
  });

  it("должен устанавливать состояние воспроизведения", () => {
    const state = trackSliceReducer(undefined, setIsPlay(true));
    expect(state.isPlay).toBe(true);

    const state2 = trackSliceReducer(undefined, setIsPlay(false));
    expect(state2.isPlay).toBe(false);
  });

  it("должен устанавливать текущий плейлист", () => {
    const tracks = [mockTrack, mockTrack2];
    const state = trackSliceReducer(undefined, setCurrentPlaylist(tracks));
    expect(state.currentPlaylist).toEqual(tracks);
  });

  it("должен добавлять трек в избранное", () => {
    const state = trackSliceReducer(undefined, toggleFavorite(mockTrack));

    expect(state.favoriteTracks).toContainEqual(mockTrack);
    expect(state.favoriteTracksIds).toContain("1");
  });

  it("должен удалять трек из избранного", () => {
    const initialState = {
      currentTrack: null,
      isPlay: false,
      currentPlaylist: [],
      shuffle: false,
      repeat: false,
      shuffledPlaylist: [],
      currentIndex: -1,
      allTracks: [],
      fetchError: null,
      fetchIsLoading: false,
      favoriteTracks: [mockTrack],
      favoriteTracksIds: ["1"],
      filteredFavoriteTracks: [],
      favoriteLoading: false,
      favoritesLoaded: true,
      categoryTracks: [],
    };

    const state = trackSliceReducer(initialState, toggleFavorite(mockTrack));

    expect(state.favoriteTracks).not.toContainEqual(mockTrack);
    expect(state.favoriteTracksIds).not.toContain("1");
  });

  it("должен устанавливать избранные треки", () => {
    const favoriteTracks = [mockTrack, mockTrack2];
    const state = trackSliceReducer(
      undefined,
      setFavoriteTracks(favoriteTracks),
    );

    expect(state.favoriteTracks).toEqual(favoriteTracks);
    expect(state.favoriteTracksIds).toEqual(["1", "2"]);
  });

  it("должен очищать избранное", () => {
    const initialState = {
      currentTrack: null,
      isPlay: false,
      currentPlaylist: [],
      shuffle: false,
      repeat: false,
      shuffledPlaylist: [],
      currentIndex: -1,
      allTracks: [],
      fetchError: null,
      fetchIsLoading: false,
      favoriteTracks: [mockTrack],
      favoriteTracksIds: ["1"],
      filteredFavoriteTracks: [mockTrack],
      favoriteLoading: false,
      favoritesLoaded: true,
      categoryTracks: [],
    };

    const state = trackSliceReducer(initialState, clearFavorites());

    expect(state.favoriteTracks).toEqual([]);
    expect(state.favoriteTracksIds).toEqual([]);
    expect(state.filteredFavoriteTracks).toEqual([]);
    expect(state.favoritesLoaded).toBe(false);
  });
});
