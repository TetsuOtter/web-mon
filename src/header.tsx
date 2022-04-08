import { AppBar, Dialog, Toolbar, Button, IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { FC, useEffect, useState, CSSProperties } from "react";
import Auth from "./components/Auth";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firestore/firebaseApp";
import Menu from "./components/Menu";
import { useDispatch } from "react-redux";
import { setCurrentUserAction } from "./redux/dataManager";

const APPBAR_STYLE: CSSProperties = {
  color: "white",
  background: "black",
};

export const Header: FC = () => {
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const authButtonClicked = () => {
    if (isSignedIn)
      signOut(auth);
    else
      setIsAuthVisible(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (_user) => {
      setIsSignedIn(!!_user);
      dispatch(setCurrentUserAction(_user));
    });
  }, [dispatch]);

  return (
    <AppBar
      position="sticky"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      color="inherit"
      style={APPBAR_STYLE}
    >
      <Menu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
          >{isSignedIn ? "ログアウト" : "ログイン / 登録"}</Button>
        </div>
      </Toolbar>
      <Dialog
        open={isAuthVisible}
        onClose={() => setIsAuthVisible(false)}>
        <Auth doClose={() => setIsAuthVisible(false)} />
      </Dialog>
    </AppBar>
  )
};

export default Header;
