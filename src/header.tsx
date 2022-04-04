import { AppBar, Dialog, Toolbar, Button, IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@material-ui/icons";
import { FC, useEffect, useState, CSSProperties } from "react";
import Auth from "./components/Auth";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firestore/firebaseApp";
import Menu from "./components/Menu";

const APPBAR_STYLE: CSSProperties = {
  color: "white",
  background: "black",
};

export const Header: FC = () =>
{
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const authButtonClicked = () => {
    if (isSignedIn)
      signOut(auth);
    else
      setIsAuthVisible(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      setUser(user);
    });
  });

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      color="inherit"
      style={APPBAR_STYLE}
    >
      <Menu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        userData={user}
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
        <Auth doClose={() => setIsAuthVisible(false)}/>
      </Dialog>
    </AppBar>
  )
};

export default Header;