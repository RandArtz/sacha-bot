import { isRandy } from "./randy";

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomResponse(
  userId: string,
  normalResponses: string[],
  randyResponses?: string[],
): string {
  if (randyResponses && isRandy(userId)) {
    return getRandomFromArray(randyResponses);
  }
  return getRandomFromArray(normalResponses);
}
