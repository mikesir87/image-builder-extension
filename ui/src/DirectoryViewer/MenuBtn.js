import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback, useState } from "react";

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

const transformOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

export const MenuBtn = ({ onSave, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const onMenuClose = useCallback((e) => {
    if (e.stopPropagation)
      e.stopPropagation();
    setAnchorEl(null);
  }, []);

  const handleSaveClick = useCallback((e) => {
    e.stopPropagation();
    onSave();
  }, [onSave]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  return (
    <>
      <IconButton>
        <MoreVertIcon 
          onClick={(e) => {
            e.stopPropagation();
            if (anchorEl) setAnchorEl(null);
            else setAnchorEl(e.currentTarget);
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        open={!!anchorEl}
        onClose={onMenuClose}
      >
        <MenuItem color="secondary" onClick={handleSaveClick}>Save As...</MenuItem>
        <MenuItem color="error" onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </>
  )
}