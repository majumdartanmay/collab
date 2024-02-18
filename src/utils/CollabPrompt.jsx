import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { navigateHook,  } from './HookUtils'

export default function CollabPrompt(props) {

  const navigate = navigateHook();

  function handleSumbit(event) {
    event.preventDefault();
    const password = document.getElementById("roomPwd").value;
    if (!password) {
      props.error = "Password cannot be empty";
      return;
    }
    props.data.processPwd(password, props.room);
  }

  function goToHome() {
    navigate("/");
  }
  
  function handleCancel(e) {
    goToHome();
  }

  return (
    <div>
      <div data-testid = "collab-prompt-container" id="collab-prompt">
        <Dialog open = {props.open}>
          <DialogTitle>Alert</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.data.prompt}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="roomPwd"
              data-testid="roomPwd"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              helperText = {props.error}
              error = {props.error != ''}
            />
          </DialogContent>
          <DialogActions>
            <Button data-testid = "collab-prompt-cancel" id = "collab-prompt-cancel" onClick={handleCancel}>Cancel</Button>
            <Button data-testid = "collab-prompt-ok" id = "collab-prompt-ok" onClick={handleSumbit}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
