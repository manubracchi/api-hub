# API Hub 🔑

The console is dependent on many APIs, and since we can't store all those secrets securely on the client, we'll use a "parent" API that makes requests to other APIs using their corresponding secrets and validating the token provided by Auth0 or Firebase Auth

### How it works 🤔
- The frontend API does a request, in this request is specified the name of the api, and the path to work on. (e.g. http://localhost:8080/open-weather/data/2.5/onecall?lat=1&lon=1).
- The first part of the path is the api name (open-weather) and the rest is the api path to request.
- The backend ( this app ) validates the auth token provided by Auth0 and also limits the rate of requests to prevent abuse even for logged users.
- Then does a identical request BUT including the API key (from the env variable with the name provided in apis.json), body, params, and all the headers that aren't auth are sent as they are.
- The request response is sent to the frontend.

Check [this Whimsical link](https://whimsical.com/Cd5GytK42BAjnKvvRBo4JN)


### How to configure it
You can add all APIs you want to the *apis.json* file respecting the following pattern
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
### Local setup
```bash
yarn # or npm i

# Dev mode with logs and .env file
yarn dev # or npm run dev

# Normal mode
yarn start # or npm start
```


### Docker setup
```bash
# Create a docker container
docker build youruser/api-hub .

# Run the created container
docker run -p 8080:8080 youruser/api-hub
```