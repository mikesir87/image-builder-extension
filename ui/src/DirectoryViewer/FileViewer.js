import { Button } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useMemo, useCallback } from 'react';
import { useDockerDesktopClient } from '../dockerDesktopClient';

const TEXT_EXTENSIONS = [
  "Dockerfile", "yaml", "yml", "py", "json", "js", "py", "java", 
  "md", "README", "Jenkinsfile", "html", "css", "scss", "tpl", "env",
  "sh"
];

export const FileViewer = ({ open, filename, path, contents, onClose, onSaveClick }) => {
  const ddClient = useDockerDesktopClient();

  const fileType = useMemo(() => {
    if (!filename) return null;
    const extension = filename.split(".").pop();
    if (TEXT_EXTENSIONS.indexOf(extension) > -1)
      return "text";
    if (extension === "png")
      return "image/png";
    if (extension === "jpg" || extension === "jpeg")
      return "image/jpeg";
    return null;
  }, [filename]);

  const contentsToUse = useMemo(() => {
    if (fileType === "text") 
      return atob(contents);
    return contents;
  }, [fileType, contents]);

  return (
    <Dialog
      maxWidth="lg"
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>File Viewer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {path}/{ filename }
        </DialogContentText>

        { contents && (
          <p><Button onClick={onSaveClick}>Save File</Button></p>
        )}

        { contents === null ? 
          "Loading..." : (
            <>
              { fileType === "image/jpeg" && (
                <img style={{maxWidth: "100%"}} src={`data:image/jpeg;charset=utf-8;base64,${contentsToUse}`} />
              )}

              { fileType === "image/png" && (
                <img style={{maxWidth: "100%"}} src={`data:image/png;charset=utf-8;base64,${contentsToUse}`} />
              )}

              { fileType === "text" && (
                <pre>{ contentsToUse }</pre>
              )}

              { fileType === null && (
                <em>Unknown filetype. Unable to display contents.</em>
              )}
            </>
        )}
      </DialogContent>
    </Dialog>
  );
};