import { useEffect, useState } from "react";
import { useDockerDesktopClient } from "../dockerDesktopClient"
import { useImageBuildContext } from "./ImageBuilderContext";

export const StartBaseImageStep = ({ onCompletion }) => {
  const ddClient = useDockerDesktopClient();
  const { baseImage, setBaseImageContainerId } = useImageBuildContext();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let lastLine = null;

    ddClient.docker.cli.exec("run", [
      "-d",
      "--label", "com.docker.builder-support=true",
      baseImage,
      "tail", "-f", "/dev/null"
    ],{
      stream: {
        onOutput(data) {
          console.log(data);
          setLogs((logs) => [...logs, data.stdout]);
          lastLine = data.stdout;
        },
        onError(error) {
          console.error(error);
        },
        onClose() {
          setBaseImageContainerId(lastLine);
          onCompletion();
        },
        splitOutputLines: true,
      },
    })
  }, []);

  return (
    <>
      <p>Starting base image...</p>
      <pre>
        { logs.join("\n") }
      </pre>
    </>
  );
}