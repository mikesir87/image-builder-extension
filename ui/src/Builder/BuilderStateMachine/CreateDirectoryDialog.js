import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { useDockerDesktopClient } from "../../dockerDesktopClient";
import { useImageBuildContext } from "../ImageBuilderContext";

export const CreateDirectoryDialog = ({ open, onClose }) => {
  const ddClient = useDockerDesktopClient();
  const {baseImageContainerDetails, currentContainerDir, refreshContainerFilesystem} = useImageBuildContext();
  const [dirName, setDirName] = useState("");

  const onCreate = useCallback((e) => {
    e.preventDefault();

    ddClient.docker.cli.exec("exec", [
      "-w", currentContainerDir,
      baseImageContainerDetails.Id,
      "mkdir", dirName
    ])
    .then(() => refreshContainerFilesystem())
    .then(() => setDirName(""))
    .then(() => onClose());
  }, [currentContainerDir, dirName, ddClient, refreshContainerFilesystem, setDirName, onClose]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Directory</DialogTitle>
      <DialogContent>
        <DialogContentText>What is the name of the directory you'd like to create?</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="directoryName"
          label="Directory Name"
          type="text"
          fullWidth
          variant="standard"
          value={dirName}
          onChange={(e) => setDirName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  )
};