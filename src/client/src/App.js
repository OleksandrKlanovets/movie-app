import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Main from './components/Main';
import MovieInfo from './components/MovieInfo';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/movie/:movieId">
          <MovieInfo />
        </Route>
        <Route exact path="/">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
