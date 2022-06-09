import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Arrow = ({ isExpanded }) => {
  return (
    <ExpandMoreIcon
      data-action="expand"
      style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
    />
  );
}