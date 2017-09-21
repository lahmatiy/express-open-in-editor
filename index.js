var parseUrl = require('parseurl');
var querystring = require('querystring');
var path = require('path');
var configure = require('open-in-editor').configure;
var MESSAGE_PREFIX = '[' + require('./package.json').name + '] ';

function fail(res, code, message) {
  res.statusCode = code;
  res.end(MESSAGE_PREFIX + message);
}

module.exports = function(options) {
  var opener = configure(options || {}, function(err) {
    console.warn(MESSAGE_PREFIX + ' configure error: ', err);
  });

  return function openInEditor(req, res, next) {
    if (!opener) {
      var msg = MESSAGE_PREFIX + 'Request to open file failed, editor is not set up';
      console.warn(msg);
      return fail(res, 400, msg);
    }

    var parsedUrl = parseUrl(req);
    var filename = querystring.parse(parsedUrl.query).file;

    if (!filename) {
      return fail(res, 400, 'Parameter missed: file');
    }

    // temporary solution
    // should take in account options.base
    filename = path
      .resolve('/', filename)
      .replace(/^[a-z]+:/i, ''); // cut drive from path on Windows platform

    opener.open(filename).then(
      function() {
        res.statusCode = 200;
        res.end('OK');
      },
      function(e) {
        fail(res, 500, 'ERROR: ' + e);
      }
    );
  };
};
