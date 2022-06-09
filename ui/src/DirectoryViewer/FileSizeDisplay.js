export const FileSizeDisplay = ({ filesize }) => {
  if (filesize < 1024)
    return `${filesize} bytes`;
  
  const kbs = filesize / 1024;
  if (kbs < 1024)
    return `${kbs.toFixed(2)} KB`;

  const mbs = kbs / 1024;
  if (mbs < 1024)
    return `${mbs.toFixed(2)} MB`;

  const gbs = mbs / 1024;
  if (gbs < 1024)
    return `${gbs.toFixed(2)} GB`;
  
  const tbs = gbs / 1024;
  return `${tbs.toFixed(2)} TB`;
}