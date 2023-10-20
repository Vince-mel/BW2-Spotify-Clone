// RINTRACCIO LA ROW TARGET
const myRow = document.getElementById("mainRow");

fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=hiphop")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Errore");
    }
  })
  .then((data) => {
    console.log("Search", data);
    generateCards(data);
  })
  .catch((err) => {
    console.log(err);
  });

// FUNCTION PER GENERARE LE CARDS

/* card per screem grande */

const generateCards = (album) => {
  album.data.forEach((el, index) => {
    if (index < 16) {
      const newCol = document.createElement("div");
      newCol.classList.add("col", "my-2", "p-1","d-flex","justify-content-center");
      newCol.innerHTML = `
    <div class="card h-100 border-0 p-2 bg-white-50" style="width: 12rem;">
        <img src="${el.album.cover_big}" class="card-img-top img-fluid" alt="img-${index}">
        <div class="card-body d-flex flex-column justify-content-between px-0">
            <div>
            <h6 class="card-title"><a class="text-decoration-none text-white" href="album.html?albumId=${el.album.id}">${el.album.title}</a></h6>
            </div>
            <div>
            <p class="card-text"> <a class="text-white" href="artist.html?artistId=${el.artist.id}">${el.artist.name}</a></p>
            
            </div>
            
        </div>
    </div>
      `;
      myRow.appendChild(newCol);
    }
  });
};

// RINTRACCIO LA COL TARGET
const activityCol = document.getElementById("activityCol");
const contentCol = document.getElementById("section");
const aside2 = document.getElementById("aside2");

const closeFriendsPage = (e) => {
  // console.log(activityCol);
  activityCol.classList.add("d-none");
  activityCol.classList.add("new-width2");
  contentCol.classList.add("new-width");
};

const openFriendsPage = (e) => {
  // console.log(e.target);
  activityCol.classList.remove("d-none");
  activityCol.classList.remove("new-width2");
  contentCol.classList.remove("new-width");
};

/* LOGICA PLAYER */

function espandi() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function playA() {
  let song = JSON.parse(window.localStorage.getItem("traccia"));

  let aux = document.querySelector(".player");
  if (aux.paused || aux.currentTime === 0 || aux.ended) {
    avviaTraccia(aux, song);
  } else {
    fermaTraccia(aux);
    avviaTraccia(aux, song);
  }
}

function avviaTraccia(player, traccia) {
  player.src = traccia.preview;
  player.play();
  seconds = 1;
  let fillerBarElement = document.querySelector("#filler_bar-time");
  fillerBarElement.style.animation = "none";
  fillerBarElement.offsetHeight; /* trigger reflow */
  fillerBarElement.style.animation = null;

  setStartFillerBar();
  setNameArtistSong(traccia);
}

function fermaTraccia(player) {
  player.pause();
  setPauseFillerBar();
}
function selectedHeart() {
  let btnHeart = document.getElementById("heart");
  let btnHeartFill = document.getElementById("heart-fill");
  let modalPlaceholder = document.getElementById("modal-placeholder");
  let replaceTxtAdded = document.querySelector("#replace-txt-added");
  let replaceTxtRemoved = document.querySelector("#replace-txt-removed");

  btnHeart.classList.toggle("d-none");
  btnHeartFill.classList.toggle("d-none");
}

function selectedPlayPause() {
  let btnPlay = document.getElementById("btn_play");
  let btnPause = document.getElementById("btn_pause");
  let aux = document.querySelector(".player");

  if (!aux.paused) {
    fermaTraccia(aux);
  } else {
    aux.play();
    setStartFillerBar();
  }

  btnPlay.classList.toggle("d-none");
  btnPause.classList.toggle("d-none");
}

function selectedBtnMuteAudio() {
  let btnVolumeUp = document.querySelector("#btn_volume-up");
  let btnVolumeMute = document.querySelector("#btn_volume-mute");

  btnVolumeMute.classList.toggle("d-none");
  btnVolumeUp.classList.toggle("d-none");
}

function selectedBtnAudioColorizeGreen(event) {
  let btnSelected = event.querySelector(".bi");
  btnSelected.classList.toggle("btn_colorize-green");
}

function selectedModalControlDevic() {
  let modalElement = document.getElementById("modal_control-device");

  modalElement.classList.toggle("d-none");
}

let seconds = 1;
let clearIntervalID = 0;

function setStartFillerBar() {
  const progressTimeElement = document.querySelector("#progress-time");
  const fillerBarElement = document.querySelector("#filler_bar-time");

  fillerBarElement.classList.add("animation_filler-bar");

  const changeSeconds = setInterval(() => {
    if (seconds < 10) {
      seconds = "0" + `${seconds}`;
    }

    progressTimeElement.innerHTML = `0:${seconds}`;
    seconds++;

    clearIntervalID = changeSeconds;

    if (seconds === 31) {
      clearInterval(changeSeconds);
      seconds = 1;
    }
  }, 1000);

  if (fillerBarElement.className.includes("paused-animation_filler-bar")) {
    fillerBarElement.classList.remove("paused-animation_filler-bar");
  }
}

function setPauseFillerBar() {
  let fillerBarElement = document.querySelector("#filler_bar-time");

  fillerBarElement.classList.toggle("paused-animation_filler-bar");

  clearInterval(clearIntervalID);
}

function setNameArtistSong(traccia) {
  document.querySelector("#cover-player").src = traccia.album.cover_xl;
  document.querySelector(
    "#sub-test_player"
  ).innerHTML = `<a href="artist.html" onclick='localStorage.setItem("id_artist", ${traccia.artist.id})'>${traccia.artist.name}</a>`;
  document.querySelector("#title-song").innerHTML = traccia.title_short;
}

let newObj;

function getAudioObj(audioPreview) {
  newObj = new Audio(audioPreview);
}

function changeVolume(rangeValue) {
  let playerElement = document.querySelector(".player");
  playerElement.volume = rangeValue;
}

let audioState = false;
function mutedAudio() {
  let playerElement = document.querySelector(".player");

  if (audioState === false) {
    playerElement.muted = true;
    audioState = true;
  } else {
    playerElement.muted = false;
    audioState = false;
  }
}
