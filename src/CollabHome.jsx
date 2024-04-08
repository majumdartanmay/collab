import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import NavBar from './NavBar'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createCollabTheme} from './utils/DependencyUtils';
import { userNamePtyAtom } from './atoms/MetadataAtom'
import { addUsers, initCollabState  } from './utils/WebrtcUtils'
import { navigateHook, cookiesHook, atomHook, createAtomInstance } from './utils/HookUtils'

/**
 * Functional component for copy right UI
 *
 * @param {Object} props - Properties which are being used to create copyright UI
 * @returns {React.Component} Copyright react component
 */
function Copyright(props) {
    return (
        <Typography 
            data-testid = "copyRightTestId"
            variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                collab.com
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const userIdTVErrorAtom = createAtomInstance(false);
const userIdTVErrorMsgAtom = createAtomInstance('');

/**
 * Collab home component. Its responsibility is to ask
 * for the username and the room identification
 *
 * @returns {React.Component} CollabHome component
 */
export default function CollabHome() {
    // hooks
    const [, setCookie] = cookiesHook(["user"]);
    const [userIdTVError, ] = atomHook(userIdTVErrorAtom);
    const [userIdTVErrorMsg, ] = atomHook(userIdTVErrorMsgAtom);
    const [, setUsername] = atomHook(userNamePtyAtom);
    const navigate = navigateHook(); 
    // variables
    /**
     * Gets triggered when a user wants to enter the room of their choice
     *
     * @param {Event} event - Click event
     */
    const handleSubmit = (event) => {

        event.preventDefault();

        if (userIdTVError) return;

        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const roomId = data.get('roomid');
        setCookie("username", username, {
            path: "/"
        });
        initCollabState();
        addUsers(username);
        setUsername(username);
        navigateToApp(roomId)
    };
    
    /**
     * Navigates to http(s)://<collab>/app/<roomId> if possible
     *
     * @param {string} roomId - Room identification
     */
    function navigateToApp(roomId) {
        try {
            navigate(`/app/${roomId}`);
        }
        catch(e) {
            console.warn("Unable to move to app environment. Ignore if we are in test environnment");
            console.error(e);
        }
    }

    return (
        <ThemeProvider theme={createCollabTheme()}>
            <NavBar/>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img width = "33em" src="/logo.svg">
                    </img>
                    <Typography component="h1" variant="h5">
                        Collab
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            data-testid="username"
                            label="User name"
                            name="username"
                            autoFocus
                            error={userIdTVError}
                            helperText={userIdTVErrorMsg}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="roomid"
                            label="Room ID"
                            type="roomid"
                            id="roomid"
                            data-testid="roomid"
                        />
                        <Button
                            data-testid = "submit"
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Collaborate
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 3, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
