import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { DirectoryEntry } from "../../DirectoryViewer/DirectoryEntry";
import { useImageBuildContext } from "../ImageBuilderContext";
import { CreateDirectoryDialog } from "./CreateDirectoryDialog";
import { RunCommandDialog } from "./RunCommandDialog";

export const ContainerView = () => {
  const { baseImageContainerDetails, currentContainerDir, setCurrentContainerDir, containerDirContents, getDockerfile } = useImageBuildContext();
  const [openCreateDirectoryDialog, setOpenCreateDirectoryDialog] = useState(false);
  const [openRunCommandDialog, setOpenRunCommandDialog] = useState(false);

  const onGoUpClick = useCallback(() => {
    setCurrentContainerDir(currentDir => {
      return currentDir.split("/").slice(0, -1).join("/") || "/"
    })
  }, [setCurrentContainerDir]);

  const onDirClick = useCallback((dir) => {
    setCurrentContainerDir(c => `${c}${c.endsWith("/") ? "" : "/"}${dir}`);
  }, [setCurrentContainerDir]);

  const onCreateDirectoryDialogClose = useCallback(() => {
    setOpenCreateDirectoryDialog(false);
  }, [setOpenCreateDirectoryDialog]);

  const onRunCommandDialogClose = useCallback(() => {
    setOpenRunCommandDialog(false);
  }, [setOpenRunCommandDialog]);

  if (!baseImageContainerDetails) return null;

  return (
    <>
      <p>Container Id: { baseImageContainerDetails.Id.substr(0, 8) } &nbsp; &nbsp; Current Dir: <code>{ currentContainerDir }</code></p>
      <Button onClick={() => setOpenCreateDirectoryDialog(true)}>Create Directory</Button>
      <Button onClick={() => setOpenRunCommandDialog(true)}>Run Command</Button>
      <Button onClick={getDockerfile}>Get Dockerfile</Button>
      
      { containerDirContents ? (
        <ul>
          { currentContainerDir !== "/" && (
            <li><a href="#" onClick={onGoUpClick}>../</a></li>
          )}
          { containerDirContents.map((item) => (
            <DirectoryEntry 
              key={item.name} 
              entry={item} 
              onDirClick={() => onDirClick(item.name)}
            />
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}

      <CreateDirectoryDialog 
        open={openCreateDirectoryDialog} 
        onClose={onCreateDirectoryDialogClose}
      />

      <RunCommandDialog 
        open={openRunCommandDialog} 
        onClose={onRunCommandDialogClose}
      />
    </>
  );
}