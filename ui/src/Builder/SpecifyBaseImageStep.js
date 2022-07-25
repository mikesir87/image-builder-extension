import { Button } from "@mui/material";
import { useState } from "react";
import { useDockerDesktopClient } from "../dockerDesktopClient";
import { useImageBuildContext } from "./ImageBuilderContext";

export const SpecifyBaseImageStep = ({ onCompletion }) => {
  const ddClient = useDockerDesktopClient();
  const {baseImage, setBaseImage, buildContext, setBuildContext} = useImageBuildContext();

  const onFormSubmission = (e) => {
    e.preventDefault();
    onCompletion();
  };

  const onContextSelectClick = (e) => {
    e.preventDefault();

    ddClient.desktopUI.dialog.showOpenDialog({
      title: "Select a directory",
      properties: ["openDirectory"]
    }).then((result) => {
      console.log("Setting result", result);
      if (result.canceled) return;
      setBuildContext(result.filePaths[0]);
    })
  };

  return (
    <>
      <h1>Hello! Let's build an image together!</h1>
      <form onSubmit={onFormSubmission}>
        <div style={{marginBottom: "2em"}}>
          <div><label htmlFor="imageBase">Image Base</label></div>
          <input 
            id="imageBase"
            name="imageBase"
            type="text" 
            value={baseImage} 
            placeholder="e.g. nginx, node:lts-alpine, alpine, or ubuntu"
            onChange={(e) => setBaseImage(e.target.value)} 
          />
          <p>The base image to start from</p>
        </div>

        <div style={{marginBottom: "2em"}}>
          <div><label htmlFor="buildContext">Host File Location</label></div>
          <input 
            id="buildContext"
            name="buildContext"
            type="text" 
            value={buildContext} 
            readOnly
            disabled
          />
          <Button onClick={onContextSelectClick}>Choose Directory</Button>
          <p>A host directory that contains files/directories you want to copy into your image (optional)</p>
        </div>

        <div>
          <Button 
            type="submit"
            variant="contained"
            disabled={!baseImage}
          >Next &rarr;</Button>
        </div>
      </form>
    </>
  );
}