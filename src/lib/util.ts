import { SearchParam } from "@/components/Player/PlayerController";

export function artistsToString(artists: string[] | undefined) {
  if (!artists) return "Unknown";
  return artists.join(", ");
}

export function msToTime(ms: number | undefined) {
  if (!ms) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds.toString().padStart(2, "0");

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const paddedMinutes = remainingMinutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  if (minutes < 10) return `0${minutes}:${paddedSeconds}`;
  return `${minutes}:${paddedSeconds}`;
}

export function hashString(str: string): number {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export function bi2n(num: bigint | undefined | null): number | undefined {
  if (num === undefined || num === null) return undefined;
  return Number(BigInt(num));
}

export function convertBigInts(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export function searchParamToPlayerState(type: SearchParam) {
  if (type === "1") return 1;
  if (type === "2") return 2;
  else return 0;
}

export function fisherYates(n: number): number[] {
  const array = Array.from({ length: n }, (_, index) => index);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
