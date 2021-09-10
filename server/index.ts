import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';
//Don't check in this file!
import { accessToken } from "./accessToken"
import { nextTick } from 'process';
const PORT = process.env.PORT ?? 8081;
const axios = require('axios');

//VideopolisOptions for getting token
const videopolisTokenAxios = {
  method: 'POST',
  url: 'https://videopolis.development.telmediq.com/openid/token/',
  data: "grant_type=client_credentials",
  headers: {
    'Authorization': 'Basic ' + accessToken,
    'content-type': 'application/x-www-form-urlencoded'
  } 
}
const app = express();
app.use(express.json());


const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware = noopMiddleware;
//Get videopolis token
app.all('/token', (req, r, next) => {
  axios(videopolisTokenAxios)
  .then(res => {
    if (res.status === 200 && res.data.access_token) {
      //Return the acesstoken from videopolis here
      r.json({'token': res.data.access_token})
      next();
    }
  })
  .catch(error => {
    console.error(error)
  })
});
app.use((req, res, next) => {
  // Here we add Cache-Control headers in accordance with the create-react-app best practices.
  // See: https://create-react-app.dev/docs/production-build/#static-file-caching
  if (req.path === '/' || req.path === 'index.html') {
    res.set('Cache-Control', 'no-cache');
  } else {
    res.set('Cache-Control', 'max-age=31536000');
  }
  next();
});
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (_, res) => {
  // Don't cache index.html
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
