var express = require('express');
var path = require('path');
var compression = require('compression');

var port = 8080;
var app = express();
var distPath = path.resolve(__dirname, '../dist');

app.use(compression());
app.use(express.static(distPath));
app.listen(port, function() {
  console.log('Server running on port ' + port);
});