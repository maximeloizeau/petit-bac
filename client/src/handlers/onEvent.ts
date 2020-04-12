import { browserHistory } from "../App";
import { setGame, setRound } from "../app/game";
import { store } from "../app/store";

export function onEvent(eventData: { [key: string]: any }) {
  const { event } = eventData as { event: string };

  console.log("Received event", eventData);
  switch (event) {
    case "gamecreated":
      // Go to lobby
      store.dispatch(setGame(eventData.game));
      browserHistory.push(`/game/${eventData.game.id}/lobby`);
      break;

    case "gameupdate":
      store.dispatch(setGame(eventData.game));
      break;

    case "roundstarted":
      store.dispatch(setGame(eventData.game));
      store.dispatch(setRound(eventData.round));
      browserHistory.push(`/game/${eventData.game.id}/round`);
      break;
  }
}
