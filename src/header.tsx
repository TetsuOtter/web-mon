import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@material-ui/icons";
import { FC, useState } from "react";

const APPBAR_STYLE: CSSProperties = {
  color: "white",
  background: "black",
};

export const Header: FC = () =>
{
  const [isFullscreen, setIsFullscreen] = useState(false);

  const changeWindowState = () => {
    const _isFullscreen = !!document.fullscreenElement;

    if (_isFullscreen)
      document.exitFullscreen();
    else
      document.body.requestFullscreen();

    setIsFullscreen(!_isFullscreen);
  }

  return (
    <AppBar
      position="static"
      color="inherit"
      style={APPBAR_STYLE}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Button
          onClick={changeWindowState}
          color="inherit"
        >{isFullscreen ? "EXIT" : "Enter"} Fullscreen</Button>

        <Button
          color="inherit"
        >-&gt; WestMON</Button>
      </Toolbar>
    </AppBar>
  )
};

export default Header;