const myForm = document.getElementById("ricerca");
const Input = document.getElementById("input");

myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(Input.value);

  fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/search?q=${Input.value}`
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Errore");
      }
    })
    .then((data) => {
      console.log("Search", data);
      generateTracks(data);
      // generateDetails(data);
      // generateCards(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

const defaultContent = document.getElementById("defaultContent");

console.log(defaultContent.querySelectorAll("div"));

defaultContent.querySelectorAll("img").forEach((el) => {
  el.classList.add( "ms-4", "mb-4");
});

/* GENERA BRANI */

const bgContent = document.getElementById("brani");
const albumSection = document.getElementById("albumSection");

// FUNCTION PER GENERARE LE TRACKS
const generateTracks = (tracks) => {
  albumSection.classList.remove("d-none");
  bgContent.innerHTML = "";
  tracks.data.forEach((el, index) => {
    if (index < 15) {
      let seconds = el.duration % 60;
      seconds = seconds.toString().padStart(2, "0");
      const options = {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      };

      const content = document.createElement("div");
      content.classList.add("d-flex", "align-items-center", "px-4");
      content.innerHTML = `
  <div class="col col-md-8 d-flex flex-grow-1 justify-content-between py-2">
     <div class="d-flex">
       <img src="${el.album.cover_big}" height="50px" class="me-2">
       <div class="d-flex flex-column justify-content-center">
       <a class="text-decoration-none text-white" href="album.html?albumId=${
         el.album.id
       }">
       <h6 class="mb-0 pe-3">${el.album.title}</h6>
       
       </a>
       <p class="mb-0 text-secondary text-decoration-underline">${
         el.artist.name
       }</p>
       </div>
     </div>
     <div class="d-flex align-items-center">
       <i
         style="font-size: 1.5em"
         class="bi bi-three-dots-vertical d-md-none"
       ></i>
       <p class="mb-0 d-none d-md-block">${el.rank.toLocaleString(
         "it-IT",
         options
       )}</p>
     </div>
    </div>
  
  `;

      bgContent.appendChild(content);
    }
  });
};

/* GENERA ARTISTI */

/* GENERA ALBUM */
const bgContent1 = document.getElementById("album");

const generateDetails = (details) => {
  const secondRow = document.createElement("div");
  secondRow.innerHTML = `
  <div class="d-flex justify-content-center mt-4">
  <img src="${
    details.album.cover_big
  }" crossorigin="anonymous" alt="img" width="70%" id="myImg"/>
</div>
<div class="d-flex flex-column justify-content-end">
  <h1 class="mt-4 fs-md-4">${details.album.title}</h1>
  <div class="d-flex align-items-center">
    <img
      src="${details.album.picture_big}"
      width="10%"
      class="rounded-5 me-2"
      alt="img"
    
    <p class="ms-2 mb-0 d-flex align-items-center">${details.album.name}</p>
    <p class="ms-2 mb-0 d-flex align-items-center">${
      details.album.tracks.data.length
    } brani</p>
    <p class="ms-2 mb-0 d-flex align-items-center">${Math.floor(
      details.duration / 60
    )}:${details.duration % 60} </p>
  </div>
</div>
  `;
  bgContent1.appendChild(secondRow);
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

/* MENU A TENDINA DX SCOMPARSA */

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
