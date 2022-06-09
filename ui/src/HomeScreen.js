import React, { useEffect, useState } from "react";
import { useDockerDesktopClient } from "./dockerDesktopClient";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const HomeScreen = () => {
  const [containers, setContainers] = useState(null);
  const ddClient = useDockerDesktopClient();

  useEffect(() => {
    ddClient.docker.listContainers()
      .then((result) => setContainers(result));
  }, []);

  if (!containers) return null;

  return (
    <div className="App">
      <Typography component="h2" variant="body1">
        Choose a Container
      </Typography>

      <ul>
        { containers.map((container) => (
          <li key={container.Id}>
            <Link to={`/containers/${container.Id}`}>
              { container.Names[0] }
            </Link>
            &nbsp;
            ({ container.State } - { container.Status })
          </li>
          ))
        }
      </ul>
    </div>
  )
}