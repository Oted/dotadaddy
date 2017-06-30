'use strict';

const Hapi = require('hapi');
const Request = require('request');
const Async = require('async');
const Path = require('path');
const Inert = require('inert');

//temp
process.env.STEAM_KEY = 'DBD3ABFFBC9911FF9CBB843ADF903083';

// Create a server with a host and port
const server = new Hapi.Server();
server.register(Inert, () => {});

server.connection({
  host: 'localhost',
  port: 8000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, '../public')
    },
    cors: true
  }
});

server.route({
  method: 'GET',
  path: '/public/{param*}',
  handler: {
    directory: {
      path: ['public'],
      listing: true,
      index: ['index.html']
    }
  }
});

server.route({
  method: 'GET',
  path:'/getProfile',
  handler: function (request, reply) {
    return Request({
      'uri' : 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + process.env.STEAM_KEY + '&steamids=' + request.query.steamid
    }, (err, res) => {
      if (err) {
        return reply(err.message).code(404);
      }

      const body = JSON.parse(res.body);

      if (!body || !body.response || !body.response.players.length) {
        return reply('No such user').code(404);
      }

      return reply(body.response.players[0]).code(200);
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

    return Request({
      'uri' : 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=' + process.env.STEAM_KEY + '&account_id=' + request.query.account_id
    }, (err, res) => {
      if (err) {
        return reply(err.message).code(404);
      }

      const body = JSON.parse(res.body);

      if (!body || !body.result) {
        return reply('No such user').code(404);
      }

      return getAdditionalMatches(request.query.account_id, body, 1, (err, additional_body) => {
        return reply(additional_body.result || body.result).code(200);
      })
    });
  }
});

const getAdditionalMatches = (account_id, body, count, next) => {
  console.log('getting aditional with count ' + count, 'matches length ' + body.result.matches.length);
  if (!count) {
    return next(null, body);
  }

  const last = body.result.matches[body.result.matches.length - 1].match_id;

  return Request({
    'uri' : 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=' + process.env.STEAM_KEY + '&account_id=' + account_id + '&start_at_match_id=' + last
  }, (err, res) => {
    if (err) {
      return getAdditionalMatches(account_id, body, 0, next.bind(null, err));
    }

    const new_body = JSON.parse(res.body);

    if (!new_body || !new_body.result) {
      return reply('No such user').code(404);
    }

    //merge the results
    body.result.matches = [...body.result.matches.slice(0,-1), ...new_body.result.matches];

    return getAdditionalMatches(account_id, body, --count, next);
  });
}

server.route({
  method: 'GET',
  path:'/getMatchDetails',
  handler: function (request, reply) {
    if (!request.query.match_id) {
      return reply('No match provided').code(400);
    }

    return Request({
      'uri' : 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=' + request.query.match_id + '&key=' + process.env.STEAM_KEY
    }, (err, res) => {
      if (err) {
        return reply(err.message).code(404);
      }

      let body = null;
      try {
        body = JSON.parse(res.body);
      } catch (err) {
        console.log(err);
        return reply('Parse wrong').code(400);
      }

      if (!body || !body.result) {
        return reply('Terrebly wrong').code(404);
      }

      return reply(body.result).code(200);
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
