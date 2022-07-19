// Set environment variables ( in development )
require("dotenv").config();

// Import dependencies
const express = require("express");
const axios = require("axios");
const debug_enabled = process.env.DEBUG ?? true;

// Used port
const PORT = process.env.PORT || 8080;

// APIs w secrets
const apis = require("./apis.json");

// Log
const log = (msg) => {
  debug_enabled && console.log(msg);
};

// App
const app = express();

// Listen for al methods in all paths
app.all("/*", async (req, res) => {
  // http://localhost:8080/open-weather/data/2.5/onecall?lat=1&lon=1
  //                      /  api_name  /         api_path          /

  const api_name = req.url.split("/")[1]; // -- open-weather
  const api_path = req.url.split("/").slice(2).join("/"); // -- /data/2.5/onecall?lat=1&lon=1

  // Before doing anything check if the API is in the apis.json file
  if (!Object.keys(apis).includes(api_name)) {
    res.status(400).send(`API [${api_name}] not included yet`);
    return;
  }

  // Get the api URL from the apis object and append the secret to the query params or the headers
  const api_url = apis[api_name].url + api_path; // -- https://api.openweathermap.org/data/2.5/onecall?lat=1&lon=1
  const url = new URL(api_url);
  const api_secret = process.env[apis[api_name].secret]; // -- SECRET 🔑
  url.searchParams.set(apis[api_name].meta, api_secret); // -- https://api.openweathermap.org/data/2.5/onecall?lat=1&lon=1&appid=SECRET

  log(`API -> ${api_name} | METHOD -> ${req.method} | URL -> ${api_path}`);

  // Do the API request 🌎
  axios({
    method: req.method,
    url: url.href,
  })
    .then(({ data }) => res.send(data))
    .catch((e) => res.status(400).send(e));
});

// Start listening 👀
app.listen(PORT);
console.log(`Running on ${PORT}`);
