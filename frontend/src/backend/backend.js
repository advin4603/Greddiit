import axios from "axios";

const backend = axios.create({
  baseURL: "http://localhost:8000/api/"
})

export default backend;

export const setAuthToken = (token) => {
  backend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const deleteAuthToken = () => {
  delete backend.defaults.headers.common["Authorization"]
}

export const isAuthTokenSet = () => {
  return backend.defaults.headers.common["Authorization"] !== undefined
}

