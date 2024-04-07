import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import { navigateHook,  } from './utils/HookUtils'

function openGithub() {
  window.open("https://github.com/majumdartanmay/collab");
}

export default function DenseAppBar() {

  const navigate = navigateHook();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton onClick = {() => {openGithub()}} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <GitHubIcon />
          </IconButton>
          <Button  color="secondary">About</Button>
          <Button color="secondary" onClick = {() => {navigate("/")}}>Home</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
