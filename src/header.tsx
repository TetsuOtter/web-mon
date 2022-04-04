import { AppBar, Dialog, Toolbar, Button, IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@material-ui/icons";
import { FC, useEffect, useState, CSSProperties } from "react";
import Auth from "./components/Auth";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firestore/firebaseApp";

const APPBAR_STYLE: CSSProperties = {
  color: "white",
  background: "black",
};

export const Header: FC = () =>
{
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const changeWindowState = () => {
    const _isFullscreen = !!document.fullscreenElement;

    if (_isFullscreen)
      document.exitFullscreen();
    else
      document.body.requestFullscreen();

    setIsFullscreen(!_isFullscreen);
  }

  const authButtonClicked = () => {
    if (isSignedIn)
      signOut(auth);
    else
      setIsAuthVisible(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => setIsSignedIn(!!user));
  });

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

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WebMON
        </Typography>

        <Button
          onClick={changeWindowState}
          color="inherit"
        >{isFullscreen ? "EXIT" : "Enter"} Fullscreen</Button>

        <Button
          color="inherit"
        >-&gt; WestMON</Button>
        <div>
          <Button
            onClick={authButtonClicked}
            color="inherit"
            variant="outlined"
          >{isSignedIn ? "ログアウト" : "ログイン / 登録"}</Button>
        </div>
      </Toolbar>
      <Dialog
        open={isAuthVisible}
        onClose={() => setIsAuthVisible(false)}>
        <Auth doClose={() => setIsAuthVisible(false)}/>
      </Dialog>
    </AppBar>
  )
};

export default Header;