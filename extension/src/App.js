import { useEffect } from "react";
import {
  Router,
  getCurrent,
  getComponentStack,
} from "react-chrome-extension-router";
import "./App.css";
import Home from "./pages/Home";
import Tenancies from "./pages/Tenancies";

function App({ parent_url, property_url, unread }) {
  if (!parent_url) {
    parent_url = "";
  }
  useEffect(() => {
    const { component, props } = getCurrent();
    console.log(
      component
        ? `There is a component on the stack! ${component} with ${props}`
        : `The current stack is empty so Router's direct children will be rendered`
    );
    const components = getComponentStack();
    console.log(`The stack has ${components.length} components on the stack`);
  });

  return (
    <Router>
      {(parent_url.indexOf("%2Fproperty%2F") > -1 || property_url) && <Tenancies />}
      {(parent_url.indexOf("%2Fproperty%2F") === -1 && !property_url) && <Home unread={unread} />}
    </Router>
  );
}

export default App;
