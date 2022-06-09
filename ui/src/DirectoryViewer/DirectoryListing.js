import { Button, ClickAwayListener, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDockerDesktopClient } from "../dockerDesktopClient";
import { parseLsOutput } from "../util/LsParser";
import { DirectoryEntry } from "./DirectoryEntry";
import { DirectoryRow } from "./DirectoryRow";
import { FileViewer } from "./FileViewer";
import { MountDisplay } from "./MountDisplay";

export const DirectoryListing = () => {
  const ddClient = useDockerDesktopClient();
  const { containerId } = useParams();
  const [containerDetails, setContainerDetails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [directoryContents, setDirectoryContents] = useState(null);
  const [mountPoints, setMountPoints] = useState(null);
  const [displayFileViewer, setDisplayFileViewer] = useState(false);
  const [fileContents, setFileContents] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const path = searchParams.get("path");

  useEffect(() => {
    ddClient.docker.listContainers()
      .then((containers) => containers.find(c => c.Id === containerId))
      .then(setContainerDetails);
  }, [containerId, ddClient, setContainerDetails]);
  
  useEffect(() => {
    if (!searchParams.get("path"))
      setSearchParams({ path: "/" });
  }, [containerId, searchParams]);

  useEffect(() => {
    setMountPoints(containerDetails ? containerDetails.Mounts : null);
  }, [containerDetails]);

  useEffect(() => {
    if (!searchParams.get("path")) return;

    ddClient.docker.cli.exec(
        "exec", 
        [`-w`, searchParams.get("path"), containerId, "ls -al"]
      ).then((result) => setDirectoryContents(parseLsOutput(result.stdout)));
  }, [containerId, searchParams, refreshCount]);

  const navigateTo = useCallback((location) => {
    const path = searchParams.get("path");
    setSearchParams({ path : path + ((path.endsWith("/")) ? "" : "/") + location });
  }, [searchParams]);

  const viewFile = useCallback((filename) => {
    setDisplayFileViewer(true);
    ddClient.docker.cli.exec("exec", ["-w", path, containerId, "base64", filename])
      .then((result) => {
        setFileContents({ name : filename, contents: result.stdout.replaceAll("\n", "") })
      });
  }, [setDisplayFileViewer, path, containerId]);

  const onFileViewerClose = useCallback(() => {
    setDisplayFileViewer(false);

    // Prevent dialog from shrinking during fadeout animation
    setTimeout(() => setFileContents(null), 750);
  }, [setDisplayFileViewer, fileContents, setFileContents]);

  const goUp = useCallback(() => {
    setSearchParams({ path: path.split("/").slice(0, -1).join("/")})
  }, [path]);

  const onFileSaveClick = useCallback((filename) => {
    ddClient.desktopUI.dialog.showOpenDialog({
      title: "Select a location to save the file(s)",
      properties: ["openDirectory", "createDirectory"]
    }).then((result) => {
      if (result.canceled) return;

      ddClient.docker.cli.exec("cp", [
        `${containerId}:${path}/${filename}`,
        result.filePaths[0],
      ]).then(() => ddClient.desktopUI.toast.success("Save completed successfully!"));
    });
  }, [ddClient, path, containerId]);

  const onCopyFileFromHostClick = useCallback(() => {
    ddClient.desktopUI.dialog.showOpenDialog({
      title: "Select a file/directory to send to the container",
      properties: ["openFile", "openDirectory"]
    }).then((result) => {
      if (result.canceled) return;

      ddClient.docker.cli.exec("cp", [
        result.filePaths[0],
        `${containerId}:${path}`,
      ]).then(() => ddClient.desktopUI.toast.success("Save completed successfully!"))
        .then(() => setRefreshCount(c => c + 1));
    });
  }, [ddClient, path, containerId, setRefreshCount]);

  const handleMouseLeave = useCallback(() => {}, []);
  
  if (!directoryContents) {
    return "Loading...";
  }

  return (
    <>
      <Grid container alignItems={"center"} marginBottom={2} spacing={3}>
        <Grid item>
          <Link to="/">Container Listing</Link>
        </Grid>
        
        <Grid item>
          { containerId.substring(0, 8) }
        </Grid>

        <Grid item>
          <strong>Current Path:</strong>
          &nbsp;
          { searchParams.get("path") }
        </Grid>
      </Grid>

      <MountDisplay path={path} mountPoints={mountPoints} />

      <p>
        <Button onClick={onCopyFileFromHostClick}>Upload Files</Button>
      </p>

      { directoryContents.length === 0 && (
        <em>There are no files in this directory</em>
      )}

      { path.length > 1 && (
        <li>
          <a href="javascript:void(0)" onClick={goUp}>../</a>
        </li>
      )}

      <Table
        stickyHeader
      >
        <colgroup>
          <col width="500" />
          <col width="200" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell size="small" style={{ paddingLeft: 32 }}>NAME</TableCell>
            <TableCell align="left" size="small">MODIFIED</TableCell>
            <TableCell style={{ paddingRight: 16 }} align="right">SIZE</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <ClickAwayListener onClickAway={handleMouseLeave}>
          <TableBody onMouseLeave={handleMouseLeave}>
            { directoryContents.map((entry) => (
              <DirectoryRow
                key={entry.name}
                item={entry}
                level={0}
                parentPath=""
                // onRemove={(parentPath, removed)}
              />
            ))}
          </TableBody>
        </ClickAwayListener>
      </Table>

      <FileViewer 
        containerId={containerId}
        filename={fileContents?.name}
        path={path}
        contents={fileContents?.contents}
        open={displayFileViewer} 
        onClose={() => onFileViewerClose(false)}
        onFileSaveClick={() => onFileSaveClick(fileContents?.name)}
      />
    </>
  );
}