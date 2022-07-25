import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { useDockerDesktopClient } from "../../dockerDesktopClient";
import { useImageBuildContext } from "../ImageBuilderContext";

export const RunCommandDialog = ({ open, onClose }) => {
  const ddClient = useDockerDesktopClient();
  const {currentContainerDir, runCommand} = useImageBuildContext();
  const [command, setCommand] = useState("");
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [logs, setLogs] = useState("");

  const onExecute = useCallback((e) => {
    e.preventDefault();

    setRunning(true);
    runCommand(currentContainerDir, command, setLogs)
      .then(() => setRunning(false))
      .then(() => setCompleted(true));
  }, [currentContainerDir, ddClient, command, onClose]);

  const handleClose = useCallback(() => {
    setLogs("");
    setCommand("");
    onClose();
    setCompleted(false);
  }, [onClose, setLogs, setCommand]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
      <DialogTitle>Run a Command</DialogTitle>
      <DialogContent>
        <DialogContentText>What command would you like to run?</DialogContentText>
        <DialogContentText><strong>Current Directory:</strong> { currentContainerDir }</DialogContentText>
          
        <TextField
          autoFocus
          margin="dense"
          id="command"
          label="Command"
          type="text"
          fullWidth
          variant="standard"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />

        { running && "Running..." }
        <pre>{ logs }</pre>
      </DialogContent>
      <DialogActions>
        { completed ? (
          <Button onClick={handleClose}>Close</Button>
        ) : (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={onExecute}>Run</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
};