import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";

import "./types";

import { ChatProvider } from "./components/ChatProvider";
import ErrorDialog from "./components/ErrorDialog/ErrorDialog";
import LoginPage from "./components/LoginPage/LoginPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import UnsupportedBrowserWarning from "./components/UnsupportedBrowserWarning/UnsupportedBrowserWarning";
import { VideoProvider } from "./components/VideoProvider";
import useConnectionOptions from "./utils/useConnectionOptions/useConnectionOptions";
import App from "./App";
import AppStateProvider, { useAppState } from "./state";
import theme from "./theme";

interface VideoAppProps {
  token: string;
}

const Video = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <ChatProvider>
        <App />
      </ChatProvider>
    </VideoProvider>
  );
};
const VideoApp = ({ token }: VideoAppProps) => {
  const { setToken } = useAppState();
  if (token) {
    setToken(token);
  }
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <UnsupportedBrowserWarning>
        <Router>
          <AppStateProvider>
            <Switch>
              <PrivateRoute exact path="/">
                <Video />
              </PrivateRoute>
              <PrivateRoute path="/room/:URLRoomName">
                <Video />
              </PrivateRoute>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Redirect to="/" />
            </Switch>
          </AppStateProvider>
        </Router>
      </UnsupportedBrowserWarning>
    </MuiThemeProvider>
  );
};

export default VideoApp;
