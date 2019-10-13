import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dashboard } from "./components/dashboard/dashboard";
import { SessionProvider } from "core";

ReactDOM.render(
  <>
  <SessionProvider>
    <Dashboard />
  </SessionProvider>
  </>,
  document.getElementById("root")
);