import { browserHistory } from "../App";

export function onEvent(eventData: { [key: string]: any }) {
  const { event } = eventData as { event: string };

  switch (event) {
    case "gamecreated":
      // Go to lobby
      browserHistory.push(`/game/${eventData.gameId}/lobby`);
      break;
  }
}
