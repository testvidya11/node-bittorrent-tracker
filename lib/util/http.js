var sprintf = require('sprintf').sprintf;

var httpConstants = require('http/constants');
var bencode = require('util/bencode');

function returnResponse(res, code, headers, data, contentLength) {
  headers = headers || {};
  data = data || '';
  contentLength = (contentLength === null || contentLength === undefined) ? 'auto' : contentLength;

  if ((contentLength === 'auto' && data.length > 0) || contentLength === true) {
    headers['Content-Length'] = data.length;
  }

  headers['Connection'] = 'close';

  res.writeHead(code, headers);
  res.end(data);
}


function returnError(res, code, msg) {
  var headers;
  code = code || 900;
  msg = msg || '';

  returnResponse(res, code, null, msg);
}

/**
 * Return a bencoded response
 */
function returnBencodedResponse(res, code, obj) {
  var headers, bencoded;
  code = code || 200;
  headers = {
    'Content-Type': 'text/plain'
  };

  bencoded = bencode.benc(obj);
  returnResponse(res, code, headers, bencoded, false);
}

function returnJson(res, code, obj) {
  returnResponse(res, code, null, JSON.stringify(obj));
}

function extractParams(req, paramsObj) {
  var paramName, paramRules, paramValue;
  var paramValues = {};

  for (paramName in paramsObj) {
    if (paramsObj.hasOwnProperty(paramName)) {
      paramRules = paramsObj[paramName];
      paramValue = req.param(paramName, paramRules['default_value']);

      if (paramValue !== null) {
        if (paramRules['type'] === 'number') {
          paramValue = parseInt(paramValue, 10);
        }
        else if (paramRules['type'] === 'boolean') {
          paramValue = parseInt(paramValue, 10);
          paramValue = Boolean(paramValue);
        }
      }

      paramValues[paramName] = paramValue;
    }
  }

  return paramValues;
}

exports.returnError = returnError;
exports.returnBencodedResponse = returnBencodedResponse;
exports.returnJson = returnJson;
exports.extractParams = extractParams;
