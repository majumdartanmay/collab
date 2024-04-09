import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import { navigateHook, } from './utils/HookUtils'

/**
 *
 * Open github page
 */
function openGithub() {
  window.open("https://github.com/majumdartanmay/collab");
}

/**
 *
 * A component to have a centralized navbar
 * in Collab
 */
export default function NavBar() {

  const navigate = navigateHook();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton onClick={() => { openGithub() }} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <GitHubIcon />
          </IconButton>
          <Button color="secondary" onClick={() => { navigate("/about") }}>About</Button>
          <Button color="secondary" onClick={() => { navigate("/") }}>Home</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
