import React from "https://esm.sh/react@17.0.2";
import {
    BrowserRouter as Router,
    Route,
    Switch
} from "https://esm.sh/react-router-dom@5.2.0";
import Home from "./Home.jsx"
import Shiritori from "./Shiritori.jsx";
import Private from "./PrivateRoom.jsx";

const App = () => {
    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route path="/public" component={Shiritori} />
                    <Route path="/private" component={Private} />
                    <Route path="/" component={Home} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;