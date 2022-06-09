import { Button, Tooltip } from "@mui/material";
import { FileSizeDisplay } from "./FileSizeDisplay"

export const DirectoryEntry = ({ entry, onDirClick, onFileView, onSaveClick }) => {
  return (
    <li>
      { entry.isDirectory ? (
        <a href="javascript:void(0)" onClick={onDirClick}>
          { entry.name }
        </a>
      ) : (
        <span>
          { entry.name }
          &nbsp;
          (<FileSizeDisplay filesize={ entry.filesize } />)

          { entry.filesize > 1048576 ? (
            <Tooltip title="File too large (1MB max)" placement="top" arrow>
              <span>
                <Button onClick={onFileView} disabled>View</Button>
              </span>
            </Tooltip>
          ) : (
            <Button onClick={onFileView}>View</Button>
          )}
        </span>
      )}

      <Button onClick={onSaveClick}>Save</Button>
    </li>
  );
}