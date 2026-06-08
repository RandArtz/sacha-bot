const OWNER_ID = process.env.OWNER_ID || "";

export function isRandy(userId: string): boolean {
  return userId === OWNER_ID;
}
