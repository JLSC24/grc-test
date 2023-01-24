import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#ffcd38",
      main: "#ffc107",
      dark: "#b28704",
    },
    secondary: {
      light: "#ffcd38",
      main: "#ffc107",
      dark: "#b28704",
    },
    error: {
      light: "#ffcd38",
      main: "#ffc107",
      dark: "#b28704",
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
