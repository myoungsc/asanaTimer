import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import FirstInputToken from './component/FirstInputToken';
import TaskList from './component/TastList';
import TaskDetail from './component/TaskDetail';

import './App.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={FirstInputToken} />
        <Route exact path="/taskList" component={TaskList} />
        <Route exact path="/taskList/Detail" component={TaskDetail} />
      </Switch>
    </Router>
  );
}
