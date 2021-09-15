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

//getter Urls
const getRoomUrl = 'https://videopolis.development.telmediq.com/api/videopolis/rooms/'
const getRoomDetailUrl = (roomIdentity: string): string => 'https://videopolis.development.telmediq.com/api/videopolis/rooms/'+roomIdentity;
const getTwilioTokenUrl = (roomIdentity: string, participantIdentity: string): string => 'https://videopolis.development.telmediq.com/api/videopolis/rooms/'+roomIdentity+'/participants/'+participantIdentity+'/token/'

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
//GetRooms Api Call
app.get('/getRooms', (req, res, next) => {
  if (!req.query.token) {
    res.json({})
    next()
  }
  const token = req.query.token as string;
  axios.get(getRoomUrl, { headers: { 'Authorization': 'Bearer '+ token}})
  .then(r => {
    if (r.status === 200 && r.data) {
      //return the data
      res.json(r.data)
      next()
    }
  })
  .catch(error => {
    console.error(error)
  })
})
//GetParticipants Api Call
app.get('/getRoomDetails', (req, res, next) => {
  if (!req.query.token || !req.query.roomIdentity) {
    res.json({})
    next()
  }
  const token = req.query.token as string;
  const roomId = req.query.roomIdentity as string;
  const getUrl = getRoomDetailUrl(roomId);
  axios.get(getUrl, { headers: { 'Authorization': 'Bearer '+ token}})
  .then(r => {
    if (r.status === 200 && r.data) {
      //return the data
      res.json(r.data)
      next()
    }
  })
  .catch(error => {
    console.error(error)
  })
})
//Get Twilio Token Api Call
app.get('/getTwilioToken', (req, res, next) => {
  if (!req.query.token || !req.query.roomIdentity || !req.query.participantIdentity) {
    res.json({})
    next()
  }
  const getUrl = getTwilioTokenUrl(req.query.roomIdentity as string, req.query.participantIdentity as string);
  const token = req.query.token as string;
  axios.get(getUrl, { headers: { 'Authorization': 'Bearer '+ token}})
  .then(r => {
    if (r.status === 200 && r.data && r.data.token) {
      //return the data and the room type hardcoded to peer-to-peer for now
      res.json({...r.data, roomType: 'peer-to-peer'})
      next()
    }
  })
  .catch(error => {
    console.error(error)
  })
})
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
