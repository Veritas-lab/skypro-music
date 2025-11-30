import { TrackTypes } from "@/SharedTypes/sharedTypes";

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
  //Используем Set для хранения уникальных значений
  const uniqueValues = new Set<string>();

  // Проходим по каждому объекту в массиве
  arr.forEach((item) => {
    const value = item[key];

    // Если значение массив строк
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          uniqueValues.add(v);
        }
      });
    }
    // Если значение строка
    else if (typeof value === "string") {
      uniqueValues.add(value);
    }
  });

  //Преобразуем обратно в массив
  return Array.from(uniqueValues);
}
