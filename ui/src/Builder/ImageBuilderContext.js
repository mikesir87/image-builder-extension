import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDockerDesktopClient } from "../dockerDesktopClient";
import { parseLsOutput } from "../util/LsParser";
import { BuilderStateMachine } from "./BuilderStateMachine/BuilderStateMachine";

const ImageBuilderContext = createContext();

export const ImageBuilderContextProvider = ({ children }) => {
  const ddClient = useDockerDesktopClient();
  const [baseImage, setBaseImage] = useState("");
  const [buildContext, setBuildContext] = useState("");

  // Container state
  const [baseImageContainerId, setBaseImageContainerId] = useState("");
  const [baseImageContainerDetails, setBaseImageContainerDetails] = useState(null);
  const [currentContainerDir, setCurrentContainerDir] = useState("/");
  const [containerDirContents, setContainerDirContents] = useState(null);
  const [containerDirRefreshCount, setContainerDirRefreshCount] = useState(0);

  // Host state
  const [hostWorkDir, setHostWorkDir] = useState("");
  const [hostDirContents, setHostDirContents] = useState(null);

  const builder = useMemo(() => {
    return new BuilderStateMachine();
  }, []);

  useEffect(() => {
    if (!baseImageContainerDetails) return;
    if (!baseImageContainerDetails.Config || !baseImageContainerDetails.Config.WorkingDir)
      return setCurrentContainerDir("/");
    setCurrentContainerDir(baseImageContainerDetails.Config.WorkingDir);
  }, [baseImageContainerDetails]);

  useEffect(() => {
    builder.setWorkDir(currentContainerDir);
  }, [currentContainerDir]);

  // Fetch container directory contents when directory changes
  useEffect(() => {
    setContainerDirContents(null);

    if (!baseImageContainerId || !currentContainerDir) 
      return;

    ddClient.docker.cli.exec(
      "exec", 
      [`-w`, currentContainerDir, baseImageContainerId, "ls -al"]
      ).then((result) => setContainerDirContents(parseLsOutput(result.stdout)));
  }, [ddClient, currentContainerDir, baseImageContainerId, setContainerDirContents, containerDirRefreshCount]);

  // Fetch container details for the base image when the ID is set
  useEffect(() => {
    if (!baseImageContainerId) return;

    ddClient.docker.cli.exec(
      "inspect", [baseImageContainerId, "--format='{{json .}}'"]
    ).then((result) => {
      const containerDetails = JSON.parse(result.stdout);
      console.log("Container details", containerDetails);
      setBaseImageContainerDetails(containerDetails);
    });
  }, [ddClient, baseImageContainerId, setBaseImageContainerId, ddClient]);

  // Fetch host directory contents
  useEffect(() => {
    ddClient.docker.cli.exec("run", [
      "--rm", 
      "--network=none", 
      "-v", `${buildContext}:/host`, 
      "-w", `/host/${hostWorkDir}`, 
      "alpine",
      "ls", "-al"]
    ).then((result) => {
      console.log("Host dir", result.stdout);
      setHostDirContents(parseLsOutput(result.stdout))
    });
  }, [ddClient, buildContext, hostWorkDir, setHostDirContents]);

  const copyToHost = useCallback((path, workDir) => {
    ddClient.docker.cli.exec("cp", [
      `${buildContext}/${path}`,
      `${baseImageContainerId}:${workDir}`
    ]).then(() => {
      builder.copyFile(path);
      setContainerDirRefreshCount(c => c + 1);
    });
  }, [buildContext, baseImageContainerId, setContainerDirRefreshCount]);

  const runCommand = useCallback((path, command, logSetter) => {
    return new Promise((acc, rej) => {
      ddClient.docker.cli.exec("exec", [
        "-w", path,
        baseImageContainerId,
        ...command.split(" "),
      ], {
        stream: {
          onOutput: (data) => { 
            if (data.stdout)
              logSetter(logs => logs + data.stdout) 
            if (data.stderr)
              logSetter(logs => logs + data.stderr) 
          },
          onClose: (exitCode) => {
            acc();
            if (exitCode === 0)
              builder.runCommand(command);
          }
        }
      })}).then(() => refreshContainerFilesystem());
  }, [ddClient, baseImageContainerId])

  const refreshContainerFilesystem = useCallback(() => {
    setContainerDirRefreshCount(c => c + 1);
  }, [setContainerDirRefreshCount]);

  const getDockerfile = useCallback(() => {
    const dockerfile = `FROM ${baseImage}\n${builder.getDockerfile()}`;
    alert(dockerfile);
  }, [builder, baseImage]);

  return (
    <ImageBuilderContext.Provider value={{ 
      baseImage, setBaseImage, buildContext, setBuildContext,
      baseImageContainerId, setBaseImageContainerId,
      baseImageContainerDetails,
      currentContainerDir, setCurrentContainerDir,
      containerDirContents, hostDirContents,
      copyToHost, getDockerfile,
      refreshContainerFilesystem,
      runCommand
    }}>
      { children }
    </ImageBuilderContext.Provider>
  );
};

export const useImageBuildContext = () => {
  return useContext(ImageBuilderContext);
};