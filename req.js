const R = require('request');

const r = () => {
    return R({
            'uri' : 'http://dota2.com/700',
            'timeout' : 10000
        }, (err, res, body) => {
        console.log(body || ('nobody', res));
        return r();
    });
}

r();
