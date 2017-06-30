import {Observable} from 'rxjs';

export function getFriends(ids) {
  return Observable.fromPromise(
    fetch('/getFriends?steamids=' + ids.join(',')).then(res=> {
      return res.json();
    })
  );
}

export function getSteamProfile(id) {
  return Observable.fromPromise(
    fetch('/getProfile?steamid=' + id)
    .then(function(res) {
      if (!res.ok) {
        throw new Error('no such profile');
      }

      return res.json();
    })
  ).catch((err) => {
    console.log('could not fetch', err);
    return Observable.empty();
  })
}

//http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/\?key\=DBD3ABFFBC9911FF9CBB843ADF903083\&account_id\=4294967295
export function getMatchHistory(id) {
  return Observable.fromPromise(
    fetch('/getMatchHistory?account_id=' + id).then(res => {
      return res.json();
    })
  );
}

export function getMatchDetails(id) {
  return Observable.defer(() => {
    return Observable.fromPromise(
      fetch('/getMatchDetails?match_id=' + id).then(res => {
        return res.json();
      })
    )
  }).retry(3);
}
