import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { Box, List, ListItemButton, ListItemIcon, SwipeableDrawer, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props
{
  isMenuOpen: boolean,
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const Menu = (props: Props) => {
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
  <SwipeableDrawer
    anchor="left"
    open={props.isMenuOpen}
    onOpen={() => props.setIsMenuOpen(true)}
    onClose={() => props.setIsMenuOpen(false)}
  >
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <Toolbar />
      <List>
        <ListItemButton
          onClick={changeWindowState}
          sx={{ position: "fixed", bottom: 10 }}
        >
          <ListItemIcon>
            {isFullscreen ? <FullscreenExit/> : <Fullscreen/>}
          </ListItemIcon>
          <ListItemText primary={(isFullscreen ? "EXIT" : "Enter") + "Fullscreen"} />
        </ListItemButton>
      </List>
    </Box>
  </SwipeableDrawer>);
};

export default Menu;
