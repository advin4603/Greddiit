import {isAuthTokenSet, setAuthToken} from "../backend/backend.js";
import {useEffect} from "react";

export default function useAuthFetchData(dataPromise, dep) {
  useEffect(()=>{
    if (!isAuthTokenSet()) {
      const jwt = JSON.parse(localStorage.getItem("jwt"))
      if (jwt === null)
        return
      setAuthToken(jwt)
    }
    dataPromise()
  }, dep)

  return {refetch: dataPromise};

}