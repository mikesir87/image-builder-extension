import React, { useEffect } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { DirectoryListingOriginal } from "./DirectoryViewer/DirectoryListingOriginal";
import { BuildImageWizard } from "./Builder/BuildImageWizard";
import { useDockerDesktopClient } from "./dockerDesktopClient";

function App() {
  const ddClient = useDockerDesktopClient();
  useEffect(async () => {
    const containerIds = (await ddClient.docker.cli.exec(
      "ps", ["-q", "--filter", "label=com.docker.builder-support"]
    )).stdout.split("\n").filter(id => id);

    if (containerIds.length > 0) {
      console.log("Removing old containers", containerIds);
      ddClient.docker.cli.exec("rm", ["-f", containerIds.join(" ")])
    }
  }, [ddClient]);

  return (
    <DockerMuiThemeProvider>
      <CssBaseline />
      <HashRouter>
        <Routes>
          {/* <Route path="/" element={<HomeScreen />} /> */}
          <Route path="/" index element={<BuildImageWizard />} />
          <Route path="/containers/:containerId/*" element={<DirectoryListingOriginal />} />
        </Routes>
      </HashRouter>
    </DockerMuiThemeProvider>
  );
}

export default App;
