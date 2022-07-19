// Set environment variables ( in development )
require("dotenv").config();

// Import dependencies
const express = require("express");
const axios = require("axios");
const debug_enabled = process.env.DEBUG ?? true;
const app = express();

// Useful constants
const port = process.env.PORT || 8080;
const apis = require("./apis.json");

// Log function
const log = (msg) => debug_enabled && console.log(msg);

// Security middleware ( e.g. check the Auth0 token )
const check_token = (req, res, next) => {
  next();
};


// Listen for al methods in all paths
app.all("/*", check_token, async (req, res) => {
  // TODO: add allowed methods filter, code the send token in the headers option, code the auth middleware

  const api_name = req.url.split("/")[1]; // e.g. open-weather
  const api_path = req.url.split("/").slice(2).join("/"); // e.g. /data/2.5/onecall?lat=1&lon=1

  // Before doing anything check if the API is in the apis.json file
  if (!Object.keys(apis).includes(api_name)) {
    res.status(400).send(`API [${api_name}] not included yet`);
    return;
  }

  // Get the api URL from the apis object and set the secret on the query params or headers
  const url = new URL(apis[api_name].url + api_path); // https://api.openweathermap.org/data/2.5/onecall?lat=1&lon=1
  const api_secret = process.env[apis[api_name].secret]; // SECRET 🔑
  url.searchParams.set(apis[api_name].meta, api_secret); // https://api.openweathermap.org/data/2.5/onecall?lat=1&lon=1&appid=SECRET ( now it has the secret )

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
app.listen(port);
console.log(`Running on ${port}`);
