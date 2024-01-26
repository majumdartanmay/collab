import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { userNamePtyAtom } from './atoms/MetadataAtom'
import { addUsers  } from './utils/WebrtcUtils'
import { navigateHook, cookiesHook, atomHook, createAtomInstance } from './utils/HookUtils'

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

const defaultTheme = createTheme({

});

const userIdTVErrorAtom = createAtomInstance(false);
const userIdTVErrorMsgAtom = createAtomInstance('');

export default function CollabHome() {
    // hooks
    const [, setCookie] = cookiesHook(["user"]);
    const [userIdTVError, ] = atomHook(userIdTVErrorAtom);
    const [userIdTVErrorMsg, ] = atomHook(userIdTVErrorMsgAtom);
    const [, setUsername] = atomHook(userNamePtyAtom);
    const navigate = navigateHook(); 
    // variables
    const handleSubmit = (event) => {

        event.preventDefault();

        if (userIdTVError) return;

        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const roomId = data.get('roomid');
        addUsers(username);
        setCookie("username", username, {
            path: "/"
        });
        setUsername(username);
        navigateToApp(roomId)
    };
    
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
        <ThemeProvider theme={defaultTheme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <BorderColorIcon />
                    </Avatar>
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
