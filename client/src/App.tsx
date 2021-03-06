import { createBrowserHistory } from "history";
import React from "react";
import "./App.css";
import { Router, Switch, Route } from "react-router-dom";
import { GameLobby } from "./features/gameLobby/GameLobby";
import { GameRound } from "./features/gameRound/GameRound";
import { GameVote } from "./features/gameVote/GameVote";
import { Home } from "./features/home/Home";
import { GameResults } from "./features/gameResults/GameResults";

export const browserHistory = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <div className="App">
            <Switch>
              <Route path="/game" component={GameRouter} />
              <Route path="/" component={Home} />
            </Switch>
          <footer>© 2020 Julia Dirand & Maxime Loizeau. All Rights Reserved.</footer>
        </div>
      </Router>
    );
  }
}

const GameRouter = ({ match }: { match: { path: string } }) => (
  <div className="container">
    <Route path={`${match.path}/:gameId/lobby`} component={GameLobby} />
    <Route path={`${match.path}/:gameId/round`} component={GameRound} />
    <Route path={`${match.path}/:gameId/results`} component={GameResults} />
    <Route path={`${match.path}/:gameId/vote`} component={GameVote} />
  </div>
);

export default App;
