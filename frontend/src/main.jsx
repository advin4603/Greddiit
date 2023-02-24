import './index.css'

import React, {createContext, useContext, useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'

import {NextUIProvider, createTheme} from "@nextui-org/react";
import {useDarkMode} from "usehooks-ts";
import {IconContext} from "phosphor-react";

import {Route, RouterProvider, Navigate, createBrowserRouter, createRoutesFromElements} from "react-router-dom";

import {JWTContext} from "./contexts/jwtContext.js";
import {setAuthToken, deleteAuthToken, isAuthTokenSet} from "./backend/backend.js";

import Root from "./routes/root/root.jsx";
import Error from "./routes/error/error.jsx";
import Auth, {loader as authLoader} from "./routes/auth/auth.jsx";
import User, {loader as userLoader} from "./routes/user/user.jsx";
import NotFound from "./routes/notFound/notFound.jsx";
import MySubgreddiits from "./routes/mySubgreddiits/mySubgreddiits.jsx";
import Subgreddiit, {loader as subgreddiitLoader} from "./routes/subgreddiit/subgreddiit.jsx";
import Explore from "./routes/explore/explore.jsx";
import Index from "./routes/root/index.jsx";

import jwtDecode from "jwt-decode";
import SavedPosts, {loader as savedPostsLoader} from "./routes/savedPosts/savedPosts";


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

function preLoader() {
  let jwt = JSON.parse(localStorage.getItem("jwt"))
  if (jwt !== null)
    setAuthToken(jwt)
  const username = jwt === null ? null : jwtDecode(jwt).username;
  return {username, jwt}
}

function Profile() {
  const {username} = useContext(JWTContext);
  return <Navigate to={`/u/${username}`} replace/>
}

function loaderMaker(loader) {
  return async (args) => {
    const authInfo = preLoader()
    return loader(args, authInfo)
  }
}

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="*" element={<NotFound/>}/>
    <Route path="/" element={<Protected><Root/></Protected>}
           errorElement={<Error/>}>
      <Route errorElement={<Error/>}>
        <Route index element={<Index />}></Route>
        <Route path="u/:username" id="user" element={<Protected><User/></Protected>} loader={loaderMaker(userLoader)}/>
        <Route path="profile" element={<Protected><Profile/></Protected>}/>
        <Route path="g/:subgreddiitTitle" element={<Protected><Subgreddiit/></Protected>}
               loader={loaderMaker(subgreddiitLoader)}/>
        <Route path="mysubgreddiits" element={<Protected><MySubgreddiits/></Protected>}/>
        <Route path="explore" element={<Protected><Explore/></Protected>}/>
        <Route path="savedposts" element={<Protected><SavedPosts/></Protected>} loader={loaderMaker(savedPostsLoader)}/>
      </Route>

    </Route>
    <Route loader={authLoader} path="/auth" element={<OnlyUnauthorized><Auth/></OnlyUnauthorized>}></Route></>
))


function App() {
  const {isDarkMode} = useDarkMode(true);
  const [jwt, setJWT] = useState(JSON.parse(localStorage.getItem("jwt")));

  useEffect(() => {
    localStorage.setItem("jwt", JSON.stringify(jwt))
    if (jwt === null)
      deleteAuthToken()
    else
      setAuthToken(jwt)
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
