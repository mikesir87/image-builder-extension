import { Grid } from "@mui/material";
import { ContainerView } from "./BuilderStateMachine/ContainerView";
import { HostView } from "./BuilderStateMachine/HostView";

export const BuilderStep = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <h1>In Your Container</h1>
        <ContainerView />
      </Grid>
      <Grid item xs={6}>
        <h1>On Your Filesystem</h1>
        <HostView />
      </Grid>
    </Grid>
  );
};