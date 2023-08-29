import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App'
import CollabHome from './CollabHome'

function Entry() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = {<CollabHome/>} />
                <Route path="/app/:hash" element = {<App/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Entry