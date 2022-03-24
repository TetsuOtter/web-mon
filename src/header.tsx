import { AppBar, Toolbar, Button, IconButton, makeStyles } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { FC, useState } from "react";

const useStyle = makeStyles({
  appBar: {
    color: "white",
    background: "black",
  },
  leftAlignButton: {
    marginLeft: "4pt",
    color: "inherit",
    textTransform: "none",
  },
  rightAlignButton: {
    marginRight: "4pt",
    color: "inherit",
    textTransform: "none",
  },
  flexGrow: {
    flexGrow: 1
  }
});

export const Header: FC = () =>
{
  const classNames = useStyle();
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
    <AppBar position="static" color="inherit" className={classNames.appBar}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Button
          className={classNames.leftAlignButton}
          onClick={changeWindowState}
        >{isFullscreen ? "EXIT" : "Enter"} Fullscreen</Button>

        <div className={classNames.flexGrow}></div>

        <Button
          className={classNames.rightAlignButton}
        >-&gt; WestMON</Button>
      </Toolbar>
    </AppBar>
  )
};

export default Header;