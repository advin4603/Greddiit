import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'

import {NextUIProvider, createTheme} from "@nextui-org/react";
import {useDarkMode} from "usehooks-ts";

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";

import './index.css'
import Root from "./routes/root/root.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root/>}>

    </Route>
  )
)

const lightTheme = createTheme({
  type: 'light',
})

const darkTheme = createTheme({
  type: 'dark',
})

function getDefaultTheme() {
  return JSON.parse(localStorage.getItem("dark")) || true;
}

function App(){
  const {isDarkMode} = useDarkMode(true);


  return (
    <React.StrictMode>
      <NextUIProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <RouterProvider router={router}/>
      </NextUIProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
