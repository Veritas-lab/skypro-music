import { TrackTypes } from "@/sharedTypes/Shared.Types";

export function formatTime(time: number) {
  const minuts = Math.floor(time / 60);
  const inputSeconds = Math.floor(time % 60);
  const outInputSeconds = inputSeconds < 10 ? `0${inputSeconds}` : inputSeconds;

  return `${minuts} : ${outInputSeconds}`;
}

export function getUniqueValueBeKey(
  arr: TrackTypes[],
  key: keyof TrackTypes
): string[] {
  const uniqueValues = new Set<string>();

  arr.forEach((item) => {
    const value = item[key];

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          uniqueValues.add(v);
        }
      });
    } else if (typeof value === "string") {
      uniqueValues.add(value);
    }
  });

  return Array.from(uniqueValues);
}
