import { AccountCircle, Fullscreen, FullscreenExit, Preview } from "@mui/icons-material";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar } from "@mui/material";
import { User } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WEST_MON_PAGE_ID } from "../index";

interface Props
{
  isMenuOpen: boolean,
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>,
  userData?: User | null,
}

export const Menu = (props: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const changeWindowState = () => {
    const _isFullscreen = !!document.fullscreenElement;

    if (_isFullscreen)
      document.exitFullscreen();
    else
      document.body.requestFullscreen();

    setIsFullscreen(!_isFullscreen);
  }

  const showWestMON = () => {
    navigate(`/${WEST_MON_PAGE_ID}${location.search}`);
  };

  return (
  <SwipeableDrawer
    anchor="left"
    open={props.isMenuOpen}
    onOpen={() => props.setIsMenuOpen(true)}
    onClose={() => props.setIsMenuOpen(false)}
  >
    <Box
      sx={{ minWidth: 270 }}
      role="presentation"
    >
      <Toolbar />
      <List>
        <Collapse in={!!props.userData}>
          <ListItem disablePadding>
            <ListItemIcon>
              <AccountCircle/>
            </ListItemIcon>
            <ListItemText primary={props.userData?.displayName ?? props.userData?.email ?? props.userData?.uid ?? "SIGNED OUT"} />
          </ListItem>
        </Collapse>

        <ListItem>
          <ListItemButton onClick={showWestMON}>
            <ListItemIcon>
              <Preview/>
            </ListItemIcon>
            <ListItemText primary={"West MON"} />
          </ListItemButton>
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemButton
            onClick={changeWindowState}
          >
            <ListItemIcon>
              {isFullscreen ? <FullscreenExit/> : <Fullscreen/>}
            </ListItemIcon>
            <ListItemText primary={(isFullscreen ? "EXIT" : "Enter") + " Fullscreen"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  </SwipeableDrawer>);
};

export default Menu;
