'use strict';

const Hapi = require('hapi');
const Async = require('async');
const Path = require('path');
const Inert = require('inert');
const Http = require('http');
const Https = require('https');
const NodeCache = require( "node-cache");

const MyCache = new NodeCache({
  stdTTL: 86400, checkperiod: 120
});

//temp
process.env.STEAM_KEY = 'DBD3ABFFBC9911FF9CBB843ADF903083';

const server = new Hapi.Server();
server.register(Inert, () => {});

server.connection({
  host: 'localhost',
  port: 8000,
  routes: {
    cors: true
  }
});

const parse = (res, cb) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    return cb(new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`));
  } else if (!/^application\/json/.test(contentType)) {
    return cb(new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`));
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      return cb(null, JSON.parse(rawData));
    } catch (e) {
      return cb(e);
    }
  });
}

server.route({
  method: 'GET',
  path:'/getProfile',
  handler: function (request, reply) {
    return Http.get({
      'host' : 'api.steampowered.com',
      'port' : 80,
      'path' : '/ISteamUser/GetPlayerSummaries/v0002/?key=' +
        process.env.STEAM_KEY +
        '&steamids=' +
        request.query.steamid,
    }, (res) => {
      return parse(res, (err, result) => {
        if (err) {
          return reply(err.message).code(404);
        }

        console.log(new Date() + ' user [' + request.query.steamid + '] requested profile ' + result.response.players[0].personaname);
        return reply(result.response.players[0]).code(200);
      });
    });
  }
});

server.route({
  method: 'GET',
  path:'/getMatchHistory',
  handler: function (request, reply) {
    if (!request.query.account_id) {
      return reply('No account provided').code(400);
    }

    return Https.get({
      'host' : 'api.steampowered.com',
      'port' : 443,
      'path' : '/IDOTA2Match_570/GetMatchHistory/V001/?key=' +
        process.env.STEAM_KEY +
        '&account_id=' +
        request.query.account_id
    }, (res) => {
      return parse(res, (err, body) => {
        if (err) {
          return reply(err.message).code(404);
        }

        return getAdditionalMatches(request.query.account_id, body, 1, (err, additional_body) => {
          if (err) {
            return reply(err.message).code(404);
          }

          return reply(additional_body.result || body.result).code(200);
        });
      });
    });
  }
});

const getAdditionalMatches = (account_id, body, count, next) => {
  if (!count) {
    return next(null, body);
  }

  const last = body.result.matches[body.result.matches.length - 1].match_id;
  return Https.get({
    'host' : 'api.steampowered.com',
    'port' : 443,
    'path' : '/IDOTA2Match_570/GetMatchHistory/V001/?key=' +
      process.env.STEAM_KEY +
      '&account_id=' +
      account_id +
      '&start_at_match_id=' +
      last
  }, (res) => {
    return parse(res, (err, new_body) => {
      if (err) {
        return getAdditionalMatches(account_id, body, 0, next.bind(null, err));
      }

      //merge the results
      body.result.matches = [...body.result.matches.slice(0,-1), ...new_body.result.matches];

      return getAdditionalMatches(account_id, body, --count, next);
    });
  });
}

server.route({
  method: 'GET',
  path:'/getMatchDetails',
  handler: function (request, reply) {
    if (!request.query.match_id) {
      return reply('No match provided').code(400);
    }

    const cached = MyCache.get("match." + request.query.match_id);

    if (cached) {
      return reply(cached).code(200);
    }

    return Https.get({
      'host' : 'api.steampowered.com',
      'port' : 443,
      'path' : '/IDOTA2Match_570/GetMatchDetails/V001/?match_id=' +
        request.query.match_id +
        '&key=' +
        process.env.STEAM_KEY
    }, (res) => {
      return parse(res, (err, body) => {
        if (err) {
          return reply(err.message).code(404);
        }

        MyCache.set("match." + request.query.match_id, body.result);
        return reply(body.result).code(200);
      });
    });
  }
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});
