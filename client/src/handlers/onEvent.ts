import { browserHistory } from "../App";
import { useDispatch } from "react-redux";
import { setGame } from "../app/game";
import { store } from "../app/store";

export function onEvent(eventData: { [key: string]: any }) {
  const { event } = eventData as { event: string };

  switch (event) {
    case "gamecreated":
      // Go to lobby
      store.dispatch(setGame(eventData.game));
      browserHistory.push(`/game/${eventData.game.id}/lobby`);
      break;

    case "gameupdate":
      store.dispatch(setGame(eventData.game));
      break;
  }
}
