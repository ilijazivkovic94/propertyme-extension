import { useEffect } from "react";
import {
  Router,
  getCurrent,
  getComponentStack,
} from "react-chrome-extension-router";
import "./App.css";
import Home from "./pages/Home";
import Tenancies from "./pages/Tenancies";

function App({ parent_url, property_url, unread, showHome, properties, contacts, data }) {
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
  let tenant_query = [];
  if (
    (parent_url.indexOf("%2Fproperty%2F") > -1 &&
      parent_url.indexOf("%2Fproperty%2Flist") < 0) ||
    property_url
  ) {
    if (parent_url.indexOf("%2Fproperty%2F") > -1) {
      query = parent_url.split("%2F");
      if (query && query[query.length - 1]) {
        if (query[query.length - 1].indexOf("%26lotId%3D") > -1) {
          query = query[query.length - 1].split("%26lotId%3D");
        } else {
          if (query[query.length - 1].indexOf("property%3D") > -1) {
            query = query[query.length - 1].split("property%3D");
          }
        }
      }
    }
    if (parent_url.indexOf("%2Ftenant%2F") > -1) {
      tenant_query = parent_url.split("%3F")[0].split("%2F");
    }
    if (property_url) {
      query = property_url.split("%2F");
    }
  }

  if (parent_url.indexOf("%2Ftenant%2F") > -1) {
    tenant_query = parent_url.split("%3F")[0].split("%2F");
  }

  return (
    <Router>
      {!showHome &&
        ((parent_url.indexOf("%2Fproperty%2F") > -1 &&
          parent_url.indexOf("%2Fproperty%2Flist") < 0) ||
          property_url ||
          parent_url.indexOf("%2Fcontact%2Fedit%2F") > -1 ||
          parent_url.indexOf("%2Fportal-access%2Ffolio-invites%2F") > -1 ||
          properties) && (
          <Tenancies
            id={query && query.length > 0 ? query[query.length - 1] : ""}
            properties={
              properties
                ? properties.substr(0, properties.length - 2).split("::")
                : []
            }
            contacts={
              contacts
                ? contacts.substr(0, contacts.length - 2).split("::")
                : []
            }
            tenant_id={tenant_query[tenant_query.length - 1]}
          />
        )}
      {((((parent_url.indexOf("%2Fproperty%2F") > -1 &&
        parent_url.indexOf("%2Fproperty%2Flist") < 0) ||
        property_url ||
        parent_url.indexOf("%2Fcontact%2Fedit%2F") > -1 ||
        properties) &&
        showHome) ||
        ((parent_url.indexOf("%2Fproperty%2F") === -1 ||
          parent_url.indexOf("%2Fproperty%2Flist") > -1) &&
          parent_url.indexOf('%2Fcontact%2Fedit') < 0 &&
          parent_url.indexOf('%2Fportal-access%2Ffolio-invites%2F') < 0 &&
          !property_url)) && <Home unread={unread} data={data} />}
    </Router>
  );
}

export default App;
