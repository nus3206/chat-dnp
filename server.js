require('dotenv').load()

const Twilio = require('twilio')
const chance = new require('chance')()
const url = require('url')
const querystring = require('querystring')
const express = require('express')
const app = express()

const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
/*
app.get('/token', function (req, res) {

  //res.json({requestBody: req.body});
  //var url_parts = url.parse(req.url, true);
  //var query = url_parts.query;

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  )

  //token.identity = chance.name()
  //let identity = req.query.user;
  token.addGrant(new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  }))

  res.send({
    identity: req.body.user,
    jwt: token.toJwt()
  })
})
*/

app.post('/token', function (req, res) {

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  )

  //token.identity = chance.name()
  token.identity = req.body.user;
  token.addGrant(new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  }))

  res.send({
    identity: token.identity,
    jwt: token.toJwt()
  })
})


app.post('/chat', function(req, res) {
  //var url_parts = url.parse(req.url, true);
  //var query = url_parts.query;

  res.send('user:' + req.body.type);    
});


app.listen(3001, function () {
  console.log('Programmable Chat token server listening on port 3001!')
})
