import { Router } from "express";
import { getAllPlayers } from "../services/playerStorage";
import { getAllGames, getGame } from "../services/gameStorage";

const mainRouter = Router();

mainRouter.get("/players", async (request, response) => {
  const players = await getAllPlayers();
  response.send(players);
});

mainRouter.get("/games", async (request, response) => {
  const games = await getAllGames();
  response.send(games);
});

mainRouter.get("/games/:id", async (request, response) => {
  const game = await getGame(request.params.id);
  response.send(game);
});

export default mainRouter;
