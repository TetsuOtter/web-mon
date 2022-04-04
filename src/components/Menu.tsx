import { Box, List, SwipeableDrawer, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props
{
  isMenuOpen: boolean,
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const Menu = (props: Props) => {
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
      </List>
    </Box>
  </SwipeableDrawer>);
};

export default Menu;
