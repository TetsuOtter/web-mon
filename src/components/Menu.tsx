import { AccountCircle, Fullscreen, FullscreenExit, Home, Place, Preview, Train, Work } from "@mui/icons-material";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar } from "@mui/material";
import { User } from "firebase/auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WEST_MON_PAGE_ID, LINE_PAGE_URL, TIMETABLE_SELECT_PAGE_URL, SHOW_TIMETABLE_PAGE_URL } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../redux/reducer";
import { setIsMenuOpen } from "../redux/setters";

interface Props {
  userData?: User | null,
}

const reduxSelector = (state: State) => {
  return {
    user: state.setSharedDataReducer.currentUser,
    line_data: state.setSharedDataReducer.lineData,
    timetable_data: state.setSharedDataReducer.trainData,
    stations: state.setSharedDataReducer.stations,
    station_id: state.setSharedDataReducer.currentStationId,
    isMenuOpen: state.setSharedDataReducer.isMenuOpen,
  };
};

export const Menu = (props: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, line_data, timetable_data, stations, station_id, isMenuOpen } = useSelector(reduxSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
      open={isMenuOpen}
      onOpen={() => dispatch(setIsMenuOpen(true))}
      onClose={() => dispatch(setIsMenuOpen(false))}
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
              <ListItemText primary="路線" secondary={line_data?.disp_name ?? "未選択"} />
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton onClick={() => navigate(TIMETABLE_SELECT_PAGE_URL + location.search)}>
              <ListItemIcon>
                <Work />
              </ListItemIcon>
              <ListItemText primary="列車" secondary={timetable_data?.train_type ?? "未選択"} />
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton onClick={() => navigate(SHOW_TIMETABLE_PAGE_URL + location.search)}>
              <ListItemIcon>
                <Place />
              </ListItemIcon>
              <ListItemText primary="現在駅" secondary={stations.find(v => v.document_id === station_id) ?? "未選択"} />
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
