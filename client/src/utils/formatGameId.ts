export function formatGameId(gameId?: string) {
  if (!gameId) return "";

  return `"${gameId.split("-")[0]}"`;
}
