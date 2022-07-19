import React from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";
import App from "./component/App.jsx";

function main() {
  ReactDOM.render(React.createElement(App), document.querySelector("#main"));
}

addEventListener("DOMContentLoaded", () => {
  main();
});
