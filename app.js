require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const path = require('path');
const compression = require('compression');

const port = process.env.PORT || 3000;
const app = express();

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    return false
  }

  // const cacheMaxAge = req.url === '/' ? '3600' : '31536000';
  // res.setHeader('Cache-Control', `public, max-age=${cacheMaxAge}`);
  return compression.filter(req, res)
}

app.use(compression({ filter: shouldCompress }));

app.use(express.static(`${__dirname}/build`));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port);
console.log(`server started on port ${port}`);