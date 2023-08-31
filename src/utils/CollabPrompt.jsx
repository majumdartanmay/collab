import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CollabPrompt(props) {

  function handleSumbit(event) {
    event.preventDefault();
    const password = document.getElementById("roomPwd").value;
    props.data.processPwd(password, props.room);
  }

  return (
    <div>
      <div id="collab-prompt">
        <Dialog open>
          <DialogTitle>Alert</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.data.prompt}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="roomPwd"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button>Cancel</Button>
            <Button onClick={handleSumbit}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
