# API Hub 🔑

The console is dependent on many APIs, and since we can't store all those secrets securely on the client, we'll use a "parent" API that makes requests to other APIs using their corresponding secrets and validating the token provided by Auth0 or Firebase Auth

Check [this Whimsical link](https://whimsical.com/Cd5GytK42BAjnKvvRBo4JN)
<br />
> 🚧 This project is under development. 🚧<br />


------------


### How it works 🤔

- The frontend API does a request, in this request is specified the name of the api, and the path to work on. (e.g. http://localhost:8080/open-weather/data/2.5/onecall?lat=1&lon=1).
- The first part of the path is the api name (open-weather) and the rest is the api path to request.
- The backend ( this app ) validates the auth token provided by Auth0 and also limits the rate of requests to prevent abuse even for logged users.
- Then does a identical request BUT including the API key (from the env variable with the name provided in apis.json), body, params, and all the headers that aren't auth are sent as they are.
- The request response is sent to the frontend.

<br />

### How to configure it

You can add all APIs you want to the _apis.json_ file respecting the following pattern

```jsx
{
  "open-weather": {                           // API name
    "type": "query",                          // Type of the API key ( header or query )
    "meta": "appid",                          // API key param / header name
    "secret": "OWEATHER_KEY",                 // Name of the env variable containing the secret
    "url": "https://api.openweathermap.org/", // URL of the API
    "allowed-methods": ["GET", "POST"],       // Allowed methods ( blank is all )
  }
}
```
<br />

### Local setup

```bash
yarn # or npm i

# Dev mode with logs and nodemon
yarn dev # or npm run dev

# Normal mode
yarn start # or npm start
```
<br />

### Docker setup

```bash
# Create a docker image
docker build youruser/api-hub .

# Run the created image
docker run -p 8080:8080 youruser/api-hub
```


<br />

### TODOs

- Send request body (client -> api).
- Send request headers (client -> api).
- If key type is header send api key as header.
- Validate Auth0 token [(see how to obtain the token).](https://auth0.com/docs/secure/tokens/access-tokens/get-access-tokens)
- Program the method filer (see apis.json allowed-methods parameter).
