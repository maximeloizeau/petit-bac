import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { GameLobby } from "./features/gameLobby/GameLobby";
import { GameRound } from "./features/gameRound/GameRound";
import { GameVote } from "./features/gameVote/GameVote";
import { Home } from "./features/home/Home";
import { GameResults } from "./features/gameResults/GameResults";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/game/123456/lobby">Game</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <div className="container">
          <Switch>
            <Route path="/game" component={GameRouter} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

const GameRouter = ({ match }: { match: { path: string } }) => (
  <div>
    <Route path={`${match.path}/:gameId/lobby`} component={GameLobby} />
    <Route path={`${match.path}/:gameId/round`} component={GameRound} />
    <Route path={`${match.path}/:gameId/results`} component={GameResults} />
    <Route path={`${match.path}/:gameId/vote`} component={GameVote} />
  </div>
);

export default App;
