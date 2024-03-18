import "./App.css";
import TodoList from "./components/TodoListFormik";
import TodoListUsingUseForm from "./components/TodoListUsingUseForm";
import User_Signup from "./components/User_Signup";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import User_login from "./components/User_login";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/user/signup" component={User_Signup} />
          <Route exact path="/" component={User_login} />
          <Route exact path="/user/todo/list" component={TodoList} />
          {/* <Route exact path="/user/todo/list" component={TodoListUsingUseForm} /> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
