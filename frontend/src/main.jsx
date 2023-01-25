import React, {createContext, useContext, useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'

import {NextUIProvider, createTheme} from "@nextui-org/react";
import {useDarkMode} from "usehooks-ts";
import {IconContext} from "phosphor-react";

import {Route, RouterProvider, Navigate, createBrowserRouter, createRoutesFromElements} from "react-router-dom";

import {JWTContext} from "./contexts/jwtContext.js";

import './index.css'
import Root from "./routes/root/root.jsx";
import Error from "./routes/error/error.jsx";
import Auth from "./routes/auth/auth.jsx";
import User, {loader as userLoader} from "./routes/user/user.jsx";
import NotFound from "./routes/notFound/notFound.jsx";
import jwtDecode from "jwt-decode";

const lightTheme = createTheme({
  type: 'light',
})

const darkTheme = createTheme({
  type: 'dark',
})


function Protected({children}) {
  const {jwt} = useContext(JWTContext);

  if (jwt === null)
    return <Navigate to="/auth" replace/>

  return children
}

function OnlyUnauthorized({children}) {
  const {jwt} = useContext(JWTContext);

  if (jwt !== null)
    return <Navigate to="/profile" replace/>

  return children
}

function Profile() {
  const {username} = useContext(JWTContext);
  return <Navigate to={`/u/${username}`} replace/>
}

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="*" element={<NotFound/>}/>
    <Route path="/" element={<Protected><Root/></Protected>}
           errorElement={<Error/>}>
      <Route errorElement={<Error/>}>
        <Route path="u/:username" id="user" element={<Protected><User/></Protected>} loader={userLoader}/>
        <Route path="profile" element={<Protected><Profile /></Protected>} />
      </Route>

    </Route>
    <Route path="/auth" element={<OnlyUnauthorized><Auth/></OnlyUnauthorized>}></Route></>
))


function App() {
  const {isDarkMode} = useDarkMode(true);
  const [jwt, setJWT] = useState(JSON.parse(localStorage.getItem("jwt")));

  useEffect(() => {
    localStorage.setItem("jwt", JSON.stringify(jwt))
  }, [jwt])
  const username = jwt === null ? null : jwtDecode(jwt).username;

  return (
    <React.StrictMode>
      <NextUIProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <IconContext.Provider value={{weight: "duotone"}}>
          <JWTContext.Provider value={{jwt, setJWT, username}}>
            <RouterProvider router={router}/>
          </JWTContext.Provider>
        </IconContext.Provider>
      </NextUIProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App/>
)
