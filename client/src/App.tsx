import { createBrowserHistory } from "history";
import React from "react";
import "./App.css";
import { Router, Switch, Route, Link } from "react-router-dom";
import { GameLobby } from "./features/gameLobby/GameLobby";
import { GameRound } from "./features/gameRound/GameRound";
import { Home } from "./features/home/Home";

export const browserHistory = createBrowserHistory();

class App extends React.Component {
  constructor(props: React.Props<{}>) {
    super(props);
  }

  render() {
    return (
      <Router history={browserHistory}>
        <div className="App">
          <div className="Container">
            <Switch>
              <Route path="/game" component={GameRouter} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

const GameRouter = ({ match }: { match: { path: string } }) => (
  <div>
    <Route path={`${match.path}/:gameId/lobby`} component={GameLobby} />
    <Route path={`${match.path}/:gameId/round`} component={GameRound} />
  </div>
);

export default App;
