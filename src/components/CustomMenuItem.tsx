import { MenuItem, Typography } from "@mui/material";

interface CustomMenuItemProps {
  id: string;
  navigate: () => void;
  handleFunction: () => void;
  icon: () => React.ReactNode;
  text: string;
}

export default function CustomMenuItem(props: CustomMenuItemProps) {

  return (
    <MenuItem dir="rtl" key={props.id} onClick={() => { props.navigate(); props.handleFunction(); }}>
      <Typography sx={{ textAlign: "center", fontFamily: "heebo, sans-serif"}}>{props.icon()} {props.text}</Typography>
    </MenuItem>
  );
}