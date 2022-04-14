import { AppBar, Dialog, Toolbar, Button, IconButton, Typography, Collapse } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { FC, useEffect, useState, CSSProperties } from "react";
import Auth from "./components/Auth";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firestore/firebaseApp";
import Menu from "./components/Menu";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStationId, setCurrentUserAction, setErrors, setIsMenuOpen, setIsToolbarVisible, setLine, setStations, setTrain } from "./redux/setters";
import { getIDParams } from "./index";
import { useLocation } from "react-router-dom";
import { State } from "./redux/reducer";
import { ToWithId } from "./redux/state.type";

const APPBAR_STYLE: CSSProperties = {
  color: "white",
  background: "black",
};

const reduxSelector = (state: State) => {
  return {
    db: state.setSharedDataReducer.dbCtrler,
    user: state.setSharedDataReducer.currentUser,
    line_id: state.setSharedDataReducer.lineDataId,
    timetable_id: state.setSharedDataReducer.trainDataId,
    stations: state.setSharedDataReducer.stations,
    station_id: state.setSharedDataReducer.currentStationId,
    is_toolbar_visible: state.setSharedDataReducer.isToolbarVisible,
  };
};

export const Header: FC = () => {
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const dispatch = useDispatch();
  const params = getIDParams(useLocation());
  const { line_id, timetable_id, station_id, stations, db, user, is_toolbar_visible } = useSelector(reduxSelector);

  const authButtonClicked = () => {
    if (user)
      signOut(auth);
    else
      setIsAuthVisible(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (_user) => {
      dispatch(setCurrentUserAction(_user));
    });
  }, [dispatch]);

  useEffect(() => {
    let touchHistoryArr: Date[] = [];

    window.addEventListener("click", (v) => {
      const TOUCH_ENABLE_AREA_PERCENTAGE = 10;
      const NEEDED_TOUCH_COUNT = 5;
      const NEEDED_TOUCHING_IN_MS = 3000;

      const isXEffectual = v.x < (window.innerWidth * TOUCH_ENABLE_AREA_PERCENTAGE / 100);
      const isYEffectual = v.y < (window.innerHeight * TOUCH_ENABLE_AREA_PERCENTAGE / 100);

      if (!isXEffectual || !isYEffectual)
        return;

      touchHistoryArr.push(new Date());

      if (touchHistoryArr.length < NEEDED_TOUCH_COUNT)
        return;

      touchHistoryArr = touchHistoryArr.slice(-NEEDED_TOUCH_COUNT);

      const diff = touchHistoryArr[4].getTime() - touchHistoryArr[0].getTime();
      if (diff <= NEEDED_TOUCHING_IN_MS) {
        touchHistoryArr = [];
        dispatch(setIsToolbarVisible(undefined));
      }
    });
  }, []);

  const loadAndSetLineData = (id?: string) => {
    if (!id)
      return Promise.reject();
    if (!db)
      return Promise.reject("db was NULL (@loadAndSetLineData)");

    return db.getLineDoc(id).then(v => {
      const gotData = v.data();
      if (gotData)
        return dispatch(setLine(v.id, gotData));
      else
        return Promise.reject("gotData was empty (@loadAndSetLineData)");
    }).catch(err => dispatch(setErrors(err)));
  };

  const loadAndSetTimetableData = (_line_id?: string, _timetable_id?: string) => {
    if (!_line_id || !_timetable_id)
      return Promise.reject();
    if (!db)
      return Promise.reject("db was NULL (@loadAndSetTimetableData)");

    return db.getTimetableDoc(_line_id, _timetable_id).then(v => {
      const gotData = v.data();
      if (gotData) {
        const toReturn = dispatch(setTrain(v.id, gotData));

        return db.get1to9StationDocs(_line_id, _timetable_id).then(v => {
          dispatch(setStations(v.docs.map(d => ToWithId(d.id, d.data()))));
          return toReturn;
        });
      }
      else
        return Promise.reject("gotData was empty (@loadAndSetTimetableData)");
    }).catch(err => dispatch(setErrors(err)));
  };

  const setStationId = (_station_id?: string) => {
    if (_station_id && stations?.find(v => v.document_id === _station_id))
      return dispatch(setCurrentStationId(_station_id));
    else
      return {};
  };

  useEffect(() => {
    const param_line_id = params["line-id"];
    const param_timetable_id = params["timetable-id"];
    const param_station_id = params["station-id"];

    if (line_id !== param_line_id)
      loadAndSetLineData(param_line_id)
        .then(() => loadAndSetTimetableData(param_line_id, param_timetable_id))
        .then(() => setStationId(param_station_id))
        .catch(err => dispatch(setErrors(err)));
    else if (timetable_id !== param_timetable_id)
      loadAndSetTimetableData(param_line_id, param_timetable_id)
        .then(() => setStationId(param_station_id))
        .catch(err => dispatch(setErrors(err)));
    else if (station_id !== param_station_id)
      setStationId(param_station_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <AppBar
      position="sticky"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      color="inherit"
      style={APPBAR_STYLE}
    >
      <Menu />
      <Collapse in={is_toolbar_visible}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => dispatch(setIsMenuOpen(undefined))}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WebMON
          </Typography>

          <div>
            <Button
              onClick={authButtonClicked}
              color="inherit"
              variant="outlined"
            >{user ? "ログアウト" : "ログイン / 登録"}</Button>
          </div>
        </Toolbar>
      </Collapse>
      <Dialog
        open={isAuthVisible}
        onClose={() => setIsAuthVisible(false)}>
        <Auth doClose={() => setIsAuthVisible(false)} />
      </Dialog>
    </AppBar>
  )
};

export default Header;
