import React from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App'
function Entry() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/app/:hash" element = {<App/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Entry