import { AccountCircle, Fullscreen, FullscreenExit, Home, Place, Preview, Train, Work } from "@mui/icons-material";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar } from "@mui/material";
import { User } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WEST_MON_PAGE_ID, LINE_PAGE_URL, TIMETABLE_SELECT_PAGE_URL, SHOW_TIMETABLE_PAGE_URL } from "../index";
import { useSelector } from "react-redux";
import { State } from "../redux/reducer";

interface Props {
  isMenuOpen: boolean,
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>,
  userData?: User | null,
}

export const Menu = (props: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const user = useSelector<State, User | null>(v => v.setCurrentUserReducer.currentUser);
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
          <ListItem>
            <ListItemButton onClick={() => navigate("/" + location.search)}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="HOME" />
            </ListItemButton>
          </ListItem>

          <Collapse in={true}>
            <ListItem>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="ユーザ情報" secondary={user?.displayName ?? user?.email ?? user?.uid ?? "SIGNED OUT"} />
            </ListItem>
          </Collapse>

          <Divider />

          <ListItem>
            <ListItemButton onClick={() => navigate(LINE_PAGE_URL + location.search)}>
              <ListItemIcon>
                <Train />
              </ListItemIcon>
              <ListItemText primary="路線" secondary={"LINE_NAME"} />
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton onClick={() => navigate(TIMETABLE_SELECT_PAGE_URL + location.search)}>
              <ListItemIcon>
                <Work />
              </ListItemIcon>
              <ListItemText primary="列車" secondary={"TRAIN_NUMBER"} />
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton onClick={() => navigate(SHOW_TIMETABLE_PAGE_URL + location.search)}>
              <ListItemIcon>
                <Place />
              </ListItemIcon>
              <ListItemText primary="現在駅" secondary={"CURRENT_STATION"} />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemButton onClick={showWestMON}>
              <ListItemIcon>
                <Preview />
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
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </ListItemIcon>
              <ListItemText primary={(isFullscreen ? "EXIT" : "Enter") + " Fullscreen"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>);
};

export default Menu;
