import { DirectoryEntry } from "../../DirectoryViewer/DirectoryEntry";
import { useImageBuildContext } from "../ImageBuilderContext";

export const HostView = () => {
  const {buildContext, hostDirContents, copyToHost, currentContainerDir} = useImageBuildContext();

  return (
    <>
      <p>Directory: { buildContext }</p>
      { hostDirContents ? (
        <ul>
          { hostDirContents.map(entry => (
            <DirectoryEntry 
              key={entry.name} 
              entry={entry} 
              onSaveClick={() => {
                copyToHost(`${entry.name}`, currentContainerDir);
              }}
            />
          ))}
        </ul>
      ) : "Loading..."}
    </>);
};