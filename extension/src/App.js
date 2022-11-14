import { useEffect } from "react";
import {
  Router,
  getCurrent,
  getComponentStack,
} from "react-chrome-extension-router";
import "./App.css";
import Home from "./pages/Home";
import Tenancies from "./pages/Tenancies";

function App({ parent_url, property_url, unread, showHome, properties }) {
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
  let query = [];
  if (parent_url.indexOf("%2Fproperty%2Fcard") > -1 || property_url) {
    if (parent_url.indexOf("%2Fproperty%2Fcard%2F") > -1) {
      query = parent_url.split("%2F");
    }
    if (property_url) {
      query = property_url.split("%2F");
    }
  }

  return (
    <Router>
      {(!showHome && (parent_url.indexOf("%2Fproperty%2Fcard") > -1 || property_url)) && <Tenancies id={query && query.length > 0 ? query[query.length - 1] : ''} properties={properties ? properties.substr(0, properties.length - 2).split('::') : []} />}
      {(((parent_url.indexOf("%2Fproperty%2Fcard") > -1 || property_url) && showHome) || (parent_url.indexOf("%2Fproperty%2Fcard") === -1 && !property_url)) && <Home unread={unread} />}
    </Router>
  );
}

export default App;
