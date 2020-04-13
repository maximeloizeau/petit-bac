import React from "react";
import { useParams } from "react-router-dom";
import styles from "./GameVote.module.css";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPlayerId,
  selectGame,
  selectRoundResults,
  selectVoteAnswers,
  selectCountdown,
} from "../../app/game";
import {
  Round,
  Category,
  PlayerAnswer,
  PublicGame,
} from "../../../../server/src/models/Game";
import {
  nextRound,
  voteForAnswer,
  displayGameResults,
} from "../../actions/game";
import { formatGameId } from "../../utils/formatGameId";
import { Loading } from "../loading/Loading";

export function GameVote() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const countdownTimer = useSelector(selectCountdown);
  const roundResults = useSelector(selectRoundResults);
  const answers = useSelector(selectVoteAnswers);
  const dispatch = useDispatch();

  if (!game || !gameId || !roundResults || !game.creator || !answers) {
    return <div>Unable to display results: game not loaded correctly</div>;
  }

  if (game.state === "round-starting") {
    return <div><h1>Chargement du round</h1>{countdownTimer}<Loading /></div>;
  }

  const vote = (
    voteValue: boolean,
    roundId: string,
    categoryId: string,
    playerId: string
  ) =>
    dispatch(voteForAnswer(game.id, roundId, categoryId, playerId, voteValue));
  const voteYes = vote.bind(null, true);
  const voteNo = vote.bind(null, false);

  return (
    <div>
      <h1>Game {formatGameId(gameId)}</h1>

      {game.categories.map((category) =>
        ResultCategory(game, category, roundResults, answers[category.id], {
          voteYes,
          voteNo,
        })
      )}

      {playerId === game.creator.id && game.roundsLeft > 0 ? (
        <button
          className="primary"
          onClick={() => dispatch(nextRound(game.id))}
        >
          Next round
        </button>
      ) : undefined}
      {playerId === game.creator.id && game.roundsLeft === 0 ? (
        <button
          className="primary"
          onClick={() => dispatch(displayGameResults(game.id))}
        >
          Display results
        </button>
      ) : undefined}
    </div>
  );
}

function ResultCategory(
  game: PublicGame,
  category: Category,
  roundResults: Round,
  playerAnswers: PlayerAnswer[],
  { voteYes, voteNo }: { voteYes: Function; voteNo: Function }
) {
  return (
    <div key={"results" + category.id}>
      <div className="twoBoxes">
        <div className="boxOne box">
          <div className="subBox center">
            <label>Lettre</label>
            <span>{roundResults?.letter}</span>
          </div>
        </div>
        <div className="boxTwo box">
          <div className="subBox center">
            <label>Categorie</label>
            <span>{category.name}</span>
          </div>
        </div>
      </div>
      {playerAnswers.map(
        (answer) =>
          answer &&
          PlayerAnswerLine(game, roundResults.id, category.id, answer, {
            voteYes,
            voteNo,
          })
      )}
    </div>
  );
}

function PlayerAnswerLine(
  game: PublicGame,
  roundId: string,
  categoryId: string,
  answer: PlayerAnswer,
  { voteYes, voteNo }: { voteYes: Function; voteNo: Function }
) {
  const player = game.players.find(
    (player) => player && player.id === answer.playerId
  );
  const playerName = (player && player.name) || "Player";

  return (
    <div className="form" key={answer.playerId + categoryId}>
      <div className={styles.rowResult}>
        <label className={styles.player}>{playerName}</label>
        <div className={styles.rowActions}>
          <div className={styles.votes}>
            <span className={styles.result}>{answer.answer}</span>
          </div>
          <div className={styles.votes}>
            <div className={styles.rounds}>
              {answer.ratings.map((rating, i) => (
                <div
                  className={`${styles.round} ${
                    rating === true ? styles.approved : ""
                  } ${rating === false ? styles.disapproved : ""}`}
                  key={i + "rating" + categoryId}
                ></div>
              ))}
            </div>
            <button
              className={`${styles.approve} ${styles.action} `}
              onClick={() => voteYes(roundId, categoryId, answer.playerId)}
            >
              👍
            </button>
            <button
              className={`${styles.disapprove} ${styles.action} `}
              onClick={() => voteNo(roundId, categoryId, answer.playerId)}
            >
              👎
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
