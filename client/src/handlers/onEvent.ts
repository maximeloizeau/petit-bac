import { browserHistory } from "../App";
import {
  setGame,
  setRound,
  updateTimer,
  resetRound,
  setRoundResults,
} from "../app/game";
import { store } from "../app/store";
import { sendAction } from "../websocket";

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
      store.dispatch(resetRound(eventData.game));
      store.dispatch(setGame(eventData.game));
      store.dispatch(
        setRound({ round: eventData.round, game: eventData.game })
      );
      browserHistory.push(`/game/${eventData.game.id}/round`);
      break;

    case "roundtimerupdate":
      store.dispatch(updateTimer(eventData.timerValue));
      break;

    case "roundended":
      store.dispatch(
        setRound({ round: eventData.round, game: eventData.game })
      );
      const game = store.getState().game;

      const answers: { [key: string]: string } = {};
      const categories = game.currentGame?.categories || [];
      for (const category of categories) {
        answers[category.id] = game.answers[category.id] || "";
      }

      sendAction({
        action: "submitanswers",
        gameId: game.currentGame?.id,
        roundId: game.currentRound?.id,
        answers: answers,
      });
      break;

    case "roundresults":
      store.dispatch(setRoundResults(eventData.round));
      browserHistory.push(`/game/${eventData.game.id}/vote`);
      break;

    case "voteupdate":
      store.dispatch(setRoundResults(eventData.round));
      break;

    case "gameresults":
      store.dispatch(setGame(eventData.game));
      browserHistory.push(`/game/${eventData.game.id}/results`);
      break;

    case "joinfail":
      alert(eventData.message);
      browserHistory.push(`/`);
      break;
  }
}
