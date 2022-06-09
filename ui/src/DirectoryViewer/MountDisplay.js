import { Alert } from "@mui/material";
import { useMemo } from "react";

export const MountDisplay = ({ path, mountPoints }) => {
  const inMount = useMemo(() => {
    if (!mountPoints || !path) return false;

    console.log(mountPoints);

    return mountPoints.filter((mountPoint) => {
        return path.startsWith(mountPoint.Destination);
      })
      .sort((a, b) => a.path.length > b.path.length ? 1 : -1)
      .shift();
  }, [path, mountPoints]);

  if (!inMount) return null;

  return (
    <Alert severity="info" >
      <strong>Mounted Directory</strong>&nbsp;-&nbsp; 
      <strong>{inMount.Destination}</strong> in the container is&nbsp;

      { inMount.Type === "bind" && (
        <>populated by <strong>{inMount.Source.replace("/host_mnt", "")}</strong> on your machine</>
      )}

      { inMount.Type === "volume" && (
        <>populated by a volume named <strong>{inMount.Name}</strong></>
      )}
      
    </Alert>
  );
}