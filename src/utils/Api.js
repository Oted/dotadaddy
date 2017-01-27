import {Observable} from 'rxjs';


export function getSteamProfile(id) {
    return Observable.fromPromise(
        fetch('http://localhost:8000/getProfile?steamid=' + id).then(res=> {
            return res.json();
        })
    );
}

//http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/\?key\=DBD3ABFFBC9911FF9CBB843ADF903083\&account_id\=4294967295
export function getMatchHistory(id) {
    return Observable.fromPromise(
        fetch('http://localhost:8000/getMatchHistory?account_id=' + id).then(res => {
            return res.json();
        })
    );
}

export function getMatchDetails(id) {
    return Observable.defer(() => {
        return Observable.fromPromise(
            fetch('http://localhost:8000/getMatchDetails?match_id=' + id).then(res => {
                return res.json();
            })
        )
    }).retry(3);
}
