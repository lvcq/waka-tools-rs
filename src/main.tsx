import React from "react";
import ReactDOM from "react-dom/client";
import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { AppRouter } from "./AppRouter";
import "./main.css";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider style={{ height: '100%' }} theme={webDarkTheme}>
      <AppRouter />
    </FluentProvider>
  </React.StrictMode>,
);
