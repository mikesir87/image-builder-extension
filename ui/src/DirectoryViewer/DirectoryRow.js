import { TableCell, TableRow } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useState } from "react";
import { Arrow } from "./Arrow";
import { FileSizeDisplay } from "./FileSizeDisplay";
import { MenuBtn } from "./MenuBtn";

export const DirectoryRow = ({ item, level, parentPath, hoveredRowPath, updateHoveredRowPath }) => {
  const ComponentType = (item.isDirectory) ? FolderRow : FileRow;
  return (
    <ComponentType 
      item={item} 
      level={level} 
      parentPath={parentPath}
      hoveredRowPath={hoveredRowPath}
      updateHoveredRowPath={updateHoveredRowPath}
    />
  );
};

const FolderRow = ({ item, level, parentPath, hoveredRowPath, updateHoveredRowPath }) => {
  const [expanded, setExpanded] = useState(false);
  const rowPath = `${parentPath}/${item.name}`;

  return (
    <TableRow>
      <TableCell
        padding="none"
        style={{ marginLeft: `${level * 16} px`}}
      >
        <Arrow isExpanded={expanded} />
        <FolderOutlinedIcon />
        <span>{item.name}</span>
      </TableCell>
      <TableCell>{item.date}</TableCell>
      <TableCell />
      <TableCell>
        <MenuBtn
          onSave={() => alert("OK. Saving...")}
          onDelete={() => alert("OK. Deleting...")}
        />
      </TableCell>
    </TableRow>
  );
};

const FileRow = ({ item, level, parentPath, hoveredRowPath, updateHoveredRowPath }) => {
  return null;
};