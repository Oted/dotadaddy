import BigNum from 'bignumber.js';

export function convert(bigId) {
  return new BigNum(bigId).minus('76561197960265728').c[0];
}

export function inverse(smallId) {
  const convert = new BigNum('76561197960265728');
  const small = new BigNum(smallId);
  return small.plus(convert).toString();
}

export function didWin(id, pInGame, match) {
  if (match.radiant_win) {
    return pInGame.player_slot < 10;
  } else {
    return pInGame.player_slot >= 10;
  }
}

export function findPlayerInGame(id, match) {
  return match.players.filter((p) => {
    return p.account_id === id;
  })[0];
}

export function niceDate(stamp) {
  return new Date(stamp * 1000).toString().split(' ').slice(1, 3).join(' ').toLowerCase();
}

export function getNiceTimeAgo(date) {
  const hoursAgo = (new Date() - date) / (1000 * 60 * 60);

  if (hoursAgo < 1) {
    return (hoursAgo * 60).toFixed(0) + ' minutes ago';
  }

  if (hoursAgo < 24) {
    return Math.round(hoursAgo) + ' hours ago';
  }

  if (hoursAgo < 168) {
    const days = (hoursAgo / 24).toFixed(1);
    if (hoursAgo <= ((new Date()).getHours() + 24)) {
      return 'yesterday';
    }

    return (hoursAgo / 24).toFixed(0) + ' days ago';
  }

  if (hoursAgo < 672) {
    return (hoursAgo / (24 * 7)).toFixed(1) + ' weeks ago';
  }

  return (hoursAgo / 672).toFixed(1) + ' months ago';
}
