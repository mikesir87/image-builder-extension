import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomeScreen } from "./HomeScreen";
import { DirectoryListing } from "./DirectoryViewer/DirectoryListing";
import { DirectoryListingOriginal } from "./DirectoryViewer/DirectoryListingOriginal";

function App() {
  return (
    <DockerMuiThemeProvider>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/containers/:containerId/*" element={<DirectoryListingOriginal />} />
        </Routes>
      </HashRouter>
    </DockerMuiThemeProvider>
  );
}

export default App;
