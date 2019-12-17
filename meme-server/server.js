'use strict'
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
//const io = require('socket.io')(server);
const path = require('path');
const mongoose = require('mongoose');
//const User = require('./user-schema');
//const Team = require('./team-schema');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
//const db = require('./queries');
const fs = require('fs');
const db = require('./queries');


//-----Global Variables------
//--Relevant IP Addresses--
//const hostname = '192.168.1.14'; // Home
//const hostname = '192.168.0.109'; // Alex's
//const hostname = 'thequicktalk.herokuapp.com'
//const hostname = '172.16.0.119'; // Work
const hostname = '192.168.1.11' // Rosales

const localhost = '0.0.0.0';
const port = process.env.PORT || 3000;

// Not sure what the following two lines are for, but I couldn't recieve post data without them.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Setting up server
app.use('/memes-root', express.static(__dirname + '/memes-root'));


// Taking care of cross origin problems
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
});


// Start Listening
server.listen(port, localhost, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.post('/memePaths', (req, res) => {
  let accountInfo = req.body.accountInfo;
  console.log("RECIEVED MEMEPATHS FROM USER " + accountInfo.accountId + " " + accountInfo.username);

  let memes = {};
  db.getTopMemes(accountInfo.username).then(result => {
    res.send(result.rows);

  }).catch (err => {
    console.error(err.stack)
  });
});

app.post('/updateMemeVisibility', (req, res) => {
//  console.log("RECIEVED MEMEPATHS");
//  let memes = {};
//  db.getTopMemes('harold').then(result => {
//    res.send(result.rows);
//
//  }).catch (err => {
//    console.error(err.stack)
//  });
  if (req.body.accountId === 11) {
    return res.send('DEFAULT');
  }
  
  db.updateMemeVisibility(req.body.accountId, req.body.id).then(result => {
//    console.log('UPDATING VISIBILITY OF ' + req.body.id);
    res.send('Adjusted visibility status of meme ' + req.body.id);

  }).catch(err => {
    console.log(err.stack);
  })
});

app.post('/login', (req, res) => {
  let accountInfo = JSON.parse(req.body.accountInfo);

  db.validateUsernameAndPassword(accountInfo.username, accountInfo.password).then((info) => {
    let loginMessage = {
      status: false,
      username: null,
    }
    
    loginMessage.status = true;
    loginMessage.username = info.username;
    loginMessage.id = info.id;
    res.send(loginMessage);
    
  }).catch(err => {
    console.log(err.stack);
    res.send(false);
    
  });
});

app.post('/signup', (req, res) => {
  let accountInfo = JSON.parse(req.body.accountInfo);

  db.signUpUser(accountInfo.username, accountInfo.password).then((result) => {
    let loginMessage = {
      status: false,
      username: null,
    }
    
    loginMessage.status = true;
    loginMessage.username = accountInfo.username;
    res.send(loginMessage);
    
  }).catch(err => {
    console.log(err.stack);
    res.send(false);
    
  });
});




