import * as React from 'react';
import NavBar from './NavBar'
import { ThemeProvider } from '@mui/material/styles';
import { createCollabTheme } from './utils/DependencyUtils'
import './About.css';
import { Container, Link } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/*
 * Will create component for an about page
 * */
export default function CollabAbout() {
    return (
        <ThemeProvider theme={createCollabTheme()}>
            <NavBar/>
            <Container component="main" maxWidth="xs" >
                <CssBaseline/>
                <Box id = "about-container">
                        <Box className = "about-container">

                            <Typography variant = "h1">
                                <img width = "55em" src="/logo.svg">
                                </img>
                                Collab
                            </Typography>
                            <Typography variant = "subtitle1">
                                A light weight realtime text collaboration tool
                            </Typography>
                            <Typography mt = {10} variant = "subtitle2" color="#e0d1ea">
                                <p>Collab is a light weight text collaboration tool. Its uses
                                    <Link color = "inherit" href = "https://webrtc.org/"> WebRTC</Link>
                                    &nbsp; as its communication protocol.</p>

                                <p> Its still a work in progress. So feel free to <Link color = "inherit" href = "https://github.com/majumdartanmay/collab"> contribute </Link> </p>
                            </Typography>
                        </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
