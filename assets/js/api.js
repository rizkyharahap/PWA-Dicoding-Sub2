const base_url = "https://api.football-data.org/v2/";
const key = '17adcc48062f42b5a97a0b651b51ae72';
const idLeague = 2002;

let standing_url = `${base_url}competitions/${idLeague}/standings?standingType=TOTAL`;
let team_url = `${base_url}teams/`;
let proxy = 'https://cors-anywhere.herokuapp.com/';
let options = {
    headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': key
    },
    credentials: 'same-origin'
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

async function getStandings() {

    // if ("caches" in window) {
    //     caches.match(standing_url).then(function (response) {
    //         if (response) {
    //             response.json().then(function (data) {
    //                 renderStanding(data);
    //             });
    //         }
    //     });
    // }

    let standings = {};
    standings = await fetch(proxy + standing_url, options)
        .then(status)
        .then(json)
        .catch(error);

    return standings;
}

async function getTeam(id) {
    // if ("caches" in window) {
    //     caches.match(team_url + id).then(function (response) {
    //         if (response) {
    //             response.json().then(function (data) {
    //                 renderTeam(data);
    //             });
    //         }
    //     });
    // }

    let teams = {};
    teams = await fetch(proxy + team_url + id, options)
        .then(status)
        .then(json)
        .catch(error);

    return teams;
}


async function loadTeamPage(id) {
    let html = await renderTeamPage();
    document.querySelector('#body-content').innerHTML = html;
    await loadTeam(id);
    await loadFav(id);
    toggleFav(id);
}
