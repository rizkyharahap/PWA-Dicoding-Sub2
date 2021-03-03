
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        registerServiceWorker();
        requestPermission();
    });
} else {
    console.error("ServiceWorker: Browser not supported.");
}

function registerServiceWorker() {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then(function () {
            console.log("ServiceWorker: Registration successful.");
        })
        .catch(function () {
            console.log("ServiceWorker: Registration Failed.");
        });
}

function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Notification feature not allowed");
                return;
            } else if (result === "default") {
                console.error("The user closes the permission request dialog box");
                return;
            }

            if (('PushManager' in window)) {
                function urlBase64ToUint8Array(base64String) {
                    const padding = '='.repeat((4 - base64String.length % 4) % 4);
                    const base64 = (base64String + padding)
                        .replace(/-/g, '+')
                        .replace(/_/g, '/');
                    const rawData = window.atob(base64);
                    const outputArray = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; ++i) {
                        outputArray[i] = rawData.charCodeAt(i);
                    }
                    return outputArray;
                }

                navigator.serviceWorker.getRegistration().then(function (registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BIcMqEc23-ZJdXuBq0mdUkUb_kDOynGWYj9PV96cp6JbIXgCkTQIH-SiqHG-bdG2-VRfnh899PL4xpAUlo2n9xc")
                    }).then(function (subscribe) {
                        console.log('Successfully subscribed with endpoint : ', subscribe.endpoint);
                        console.log('Successfully subscribed with p256dh key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('p256dh')))));
                        console.log('Successfully subscribed with auth key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('auth')))));
                    }).catch(function (e) {
                        console.error('Unable to subscribe ', e.message);
                    });
                });
            }
        });
    }
}

async function loadStandings() {
    await renderStanding();
    initDB();
}

async function loadFavorites() {
    var indexDb = getAllDataFromDB();

    indexDb.then(function (data) {
        renderFavorite(data);
    });
}

async function renderTeamPage() {
    let html = await fetch('../../pages/team.html')
        .then(response => {
            return response.text();
        })
        .catch(error);

    return html;
}

async function loadChachesData(proxy, base_url) {
    let cachesData = {};

    await caches.match(proxy + base_url).then(response => {
        if (response) {
            cachesData = response.json();
        }
    });

    return cachesData;
}

async function renderStanding() {
    let standingElem = document.getElementById('standing-data');
    if (typeof(standingElem) != 'undefined' && standingElem != null) {
        let standings = {};
        let html = "";
        if ("caches" in window) {
            let proxy = 'https://cors-anywhere.herokuapp.com/';
            let base_url = `api.football-data.org/v2/competitions/2021/standings?standingType=TOTAL`;
            standings = await loadChachesData(proxy, base_url);
        }
        standings = await getStandings();
        standings = standings.standings[0].table;
        Object.keys(standings).forEach(standing => {
            let teamUrl = standings[standing].team.crestUrl;
            html += `
                <tr onclick="loadTeamPage(${standings[standing].team.id})" style="cursor: pointer;">
                    <td>${standings[standing].position}</td>
                    <td class="team-logos">
                        <img src="${teamUrl.replace(/^http:\/\//i, 'https://')}" style="width: 30px;margin-right: 10px;">
                        <span>${standings[standing].team.name}</span>
                    </td>
                    <td>${standings[standing].playedGames}</td>
                    <td>${standings[standing].won}</td>
                    <td>${standings[standing].draw}</td>
                    <td>${standings[standing].lost}</td>
                    <td>${standings[standing].goalsFor}</td>
                    <td>${standings[standing].goalsAgainst}</td>
                    <td>${standings[standing].goalDifference}</td>
                    <td>${standings[standing].points}</td>
                </tr>
            `;
        });
        standingElem.innerHTML = html;
    }
}

function renderFavorite(data) {
    var favoriteHTML = "";
    if (data.length > 0) {
        data.forEach((favorites) => {
            let teamUrl = favorites.teamLogo;
            favoriteHTML += `
			        <div class="col s12 m4">
                        <div class="saved-team-card-item">
                            <div class="saved-team-img-wrapper">
                                <a onclick="loadTeamPage(${favorites.teamId})" style="cursor: pointer;">
                                    <img src="${teamUrl.replace(/^http:\/\//i, 'https://')}">
                                </a>
                            </div>
                            <p>${favorites.teamTitle}</p>
                        </div>
                    </div>
                `;
        });
    } else {
        html = `
                <p>There's no favorites team</p>
            `;
    }
    document.getElementById('favorite-data').innerHTML = favoriteHTML;
}

async function toggleFav(teamId) {
    let toggleIcon = document.querySelector('.fav-icon');
    let toggleBtn = document.querySelector('.btn-team');
    let teamTitle = document.querySelector('#team-title').innerHTML;
    let teamLogo = document.querySelector('#team-img').getAttribute('src');
    let favTeamId = teamId
    toggleBtn.onclick = async () => {
        let check = await loadFav(favTeamId);
        if (check) {
            createDataToDB({
                teamId: favTeamId,
                teamLogo: teamLogo,
                teamTitle: teamTitle
            });
            toggleIcon.innerHTML = 'favorite';
            M.toast({ html: 'Team added to favorite!', classes: 'toast-bg' });
        } else {
            deleteDataFromDB(favTeamId);
            toggleIcon.innerHTML = 'favorite_border';
            M.toast({ html: 'Team removed from favorite!', classes: 'toast-bg' });
        }
    }
}

async function loadFav(teamIdFav) {
    let elemIcon = document.querySelector('.fav-icon');
    let status = false;
    let findedData = countDataInDB(teamIdFav);
    console.log(findedData);
    if (findedData < 1) {
        elemIcon.innerHTML = 'favorite_border';
        status = true;
    } else {
        elemIcon.innerHTML = 'favorite';
        status = false;
    }
    return status;
}


function renderTeam(data) {
    var teamHTML = document.getElementById("team-data");
    teamHTML.innerHTML = `
            <div class="card-image team-image">
            <img id="team-img"  src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}"  onerror="this.src='/assets/img/no_image.png">
                <a class="btn-floating halfway-fab waves-effect waves-light red btn-team" onclick="toggleFav(${data.id})"><i class="material-icons fav-icon">favorite_border</i></a>
            </div>
            <div class="card-content">
                <span id="team-title" class="card-title blue-grey-text text-darken-5">${data.name}</span>
                <p>${data.address}</p>
                <p>${data.phone}</p>
            </div>
            `;
}
