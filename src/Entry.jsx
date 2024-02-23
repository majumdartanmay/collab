import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App'
import CollabHome from './CollabHome'

/**
 * Entry point of the application. Configure your routes here
 *
 * @returns {string} Entry component
 */
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
