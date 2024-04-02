import React from 'react'
import ReactDOM from 'react-dom/client'
import Entry from "./Entry"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider>
        <Entry />
    </CookiesProvider>
  </React.StrictMode>,
)
