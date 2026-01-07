import { formatTime, getUniqueValueBeKey } from "../helpers";
import { TrackTypes } from "@/SharedTypes/SharedTypes";

describe("formatTime", () => {
  it("Добавление нуля если секунд < 10", () => {
    expect(formatTime(61)).toBe("1 : 01");
  });

  it("Форматирует время < 1 минуты", () => {
    expect(formatTime(9)).toBe("0 : 09");
  });

  it("Обрабатывает 0 секунд", () => {
    expect(formatTime(0)).toBe("0 : 00");
  });

  it("Форматирует время больше минуты", () => {
    expect(formatTime(125)).toBe("2 : 05");
  });

  it("Форматирует время ровно в минуту", () => {
    expect(formatTime(60)).toBe("1 : 00");
  });

  it("Форматирует время с большим количеством минут", () => {
    expect(formatTime(3661)).toBe("61 : 01"); // 1 час 1 минута 1 секунда
  });
});

describe("getUniqueValueBeKey", () => {
  const mockTracks: TrackTypes[] = [
    {
      _id: 1,
      name: "Трек 1",
      author: "Артист 1",
      release_date: "2023-01-01",
      genre: ["Поп", "Рок"],
      duration_in_seconds: 180,
      album: "Альбом 1",
      logo: null,
      track_file: "track1.mp3",
      starred_user: [],
    },
    {
      _id: 2,
      name: "Трек 2",
      author: "Артист 2",
      release_date: "2023-01-02",
      genre: ["Рок"],
      duration_in_seconds: 200,
      album: "Альбом 2",
      logo: null,
      track_file: "track2.mp3",
      starred_user: [],
    },
    {
      _id: 3,
      name: "Трек 3",
      author: "Артист 1",
      release_date: "2023-01-03",
      genre: ["Джаз"],
      duration_in_seconds: 150,
      album: "Альбом 3",
      logo: null,
      track_file: "track3.mp3",
      starred_user: [],
    },
  ];

  it("возвращает уникальных авторов", () => {
    const result = getUniqueValueBeKey(mockTracks, "author");
    expect(result).toEqual(["Артист 1", "Артист 2"]);
  });

  it("возвращает уникальные жанры", () => {
    const result = getUniqueValueBeKey(mockTracks, "genre");
    expect(result).toEqual(["Поп", "Рок", "Джаз"]);
  });

  it("возвращает уникальные названия треков", () => {
    const result = getUniqueValueBeKey(mockTracks, "name");
    expect(result).toEqual(["Трек 1", "Трек 2", "Трек 3"]);
  });

  it("возвращает уникальные даты релиза", () => {
    const result = getUniqueValueBeKey(mockTracks, "release_date");
    expect(result).toEqual(["2023-01-01", "2023-01-02", "2023-01-03"]);
  });

  it("возвращает пустой массив для пустого списка треков", () => {
    const result = getUniqueValueBeKey([], "author");
    expect(result).toEqual([]);
  });

  it("обрабатывает треки с undefined значениями", () => {
    const tracksWithUndefined: TrackTypes[] = [
      {
        _id: 1,
        name: "Трек 1",
        author: "Артист 1",
        release_date: "2023-01-01",
        genre: ["Поп"],
        duration_in_seconds: 180,
        album: "Альбом 1",
        logo: null,
        track_file: "track1.mp3",
        starred_user: [],
      },
      {
        _id: 2,
        name: "Трек 2",
        author: "",
        release_date: "2023-01-02",
        genre: [],
        duration_in_seconds: 200,
        album: "",
        logo: null,
        track_file: "track2.mp3",
        starred_user: [],
      },
    ];

    const result = getUniqueValueBeKey(tracksWithUndefined, "author");
    expect(result).toEqual(["Артист 1", ""]);
  });
});
