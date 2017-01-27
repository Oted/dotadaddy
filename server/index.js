'use strict';

const Hapi = require('hapi');
const Request = require('request');
const Async = require('async');

//temp
process.env.STEAM_KEY = 'DBD3ABFFBC9911FF9CBB843ADF903083';

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000,
    routes: {
        cors: true
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

            return reply(body.result).code(200);
        });
    }
});

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
