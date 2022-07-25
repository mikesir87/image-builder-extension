export const parseLsOutput = (lsOutput) => {
  // console.log(lsOutput);
  return lsOutput.split("\n")
    .map((line, indx) => {
      const parts = line.trim().split(/\s+/);

      return {
        isDirectory : parts[0].startsWith("d"),
        isSymLink : parts[0].startsWith("l"),
        ownerUser : parts[2],
        ownerGroup : parts[3],
        filesize : parts[4],
        date : `${parts[5]} ${parts[6]} ${parts[7]}`,
        name : parts[8],
      };
    })
    .filter(r => r.name && r.name !== "." && r.name !== "..")
    .sort((a, b) => {
      // if (a.isDirectory && !b.isDirectory) return -1;
      return a.name < b.name ? -1 : 1;
    });
}