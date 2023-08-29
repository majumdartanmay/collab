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
import { useNavigate, /* other hooks */ } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { atom, useAtom } from 'jotai';
import { userNamePtyAtom } from './atoms/MetadataAtom'
import { addYUsersInWebRtc, getYUsersInWebrtc } from './utils/WebrtcUtils'

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
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
    palette: {
        mode: 'dark',
    },
});

const userIdTVErrorAtom = atom(false);
const userIdTVErrorMsgAtom = atom('');

export default function CollabHome() {
    // hooks
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["user"]);
    const [userIdTVError, setuserIdTVError] = useAtom(userIdTVErrorAtom);
    const [userIdTVErrorMsg, setuserIdTVErrorMsg] = useAtom(userIdTVErrorMsgAtom);
    const [username, setUsername] = useAtom(userNamePtyAtom);

    // variables
    const handleSubmit = (event) => {

        event.preventDefault();

        if (userIdTVError) return;

        const data = new FormData(event.currentTarget);
        const roomId = data.get('roomid');
        const username = data.get('username');
        addYUsersInWebRtc(username);
        setCookie("username", username, {
            path: "/"
        });
        setUsername(username);
        navigate(`/app/${roomId}`);
    };

    const validateUserId = (event) => {
        const currentUserId = event.target.value;
        const userList = getYUsersInWebrtc();
        const userExists = userList.indexOf(currentUserId) > -1;
        setuserIdTVError(userExists);
        if (userExists)
            setuserIdTVErrorMsg(`${currentUserId} user already exists`);
        else
            setuserIdTVErrorMsg(null);

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
                            label="User name"
                            name="username"
                            autoFocus
                            error={userIdTVError}
                            helperText={userIdTVErrorMsg}
                            onChange={validateUserId}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="roomid"
                            label="Room ID"
                            type="roomid"
                            id="roomid"
                        />
                        <Button
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