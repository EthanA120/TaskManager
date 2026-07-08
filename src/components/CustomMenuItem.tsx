import { MenuItem, Typography } from "@mui/material";

interface CustomMenuItemProps {
  key: string;
  navigate: () => void;
  handleFunction: () => void;
  icon: () => React.ReactNode;
  text: string;
}

export default function CustomMenuItem(props: CustomMenuItemProps) {

  return (
    <MenuItem key={props.key} onClick={() => { props.navigate(); props.handleFunction(); }}>
      <Typography sx={{ textAlign: "center", fontFamily: "cursive"}}>{props.icon()} {props.text}</Typography>
    </MenuItem>
  );
}