import React from "react";
import axios from "axios";
import Routes from "./routes/Routes";
import { getCookie } from "./utils/helpers";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
axios.interceptors.request.use((config) => {
  const token = getCookie("token");
  config.headers.Authorization = token;

  console.log(token);

  return config;
});

function App() {
  return <Routes />;
}

export default App;
