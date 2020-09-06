const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
let corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {origin: true}
  }
  else {
    corsOptions = {origin: false}
  }
  callback(null, corsOptions)
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);

//786735622072674
//63a9324f8a3cedd6609a3a771834f0b0