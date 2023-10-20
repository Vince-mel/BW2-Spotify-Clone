
// RINTRACCIO L'ID DALLA BARRA DI RICERCA
const addressBarContent = new URLSearchParams(location.search);
const albumId = addressBarContent.get("albumId");
console.log(albumId);

// RINTRACCIO L'ID DELLA MAIN ROW
const mainRow = document.getElementById("albumContent");
const secondRow = document.getElementById("secondContent");

// Funzione per calcolare il colore medio di un'immagine
const calculateAverageColorFromImage = (image) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Imposta le dimensioni del canvas come le dimensioni dell'immagine
  canvas.width = image.width;
  canvas.height = image.height;

  // Disegna l'immagine sul canvas
  context.drawImage(image, 0, 0, image.width, image.height);

  // Ottieni i dati dell'immagine
  const imageData = context.getImageData(0, 0, image.width, image.height).data;

  // Calcola il colore medio
  const averageColor = calculateAverageColor(imageData);

  return averageColor;
};

// Funzione per calcolare il colore medio da un array di dati dell'immagine
const calculateAverageColor = (imageData) => {
  let sumRed = 0;
  let sumGreen = 0;
  let sumBlue = 0;
  const pixelCount = imageData.length / 4; // Ogni pixel ha 4 componenti: R, G, B, A

  for (let i = 0; i < imageData.length; i += 4) {
    sumRed += imageData[i];
    sumGreen += imageData[i + 1];
    sumBlue += imageData[i + 2];
  }

  const averageRed = Math.round(sumRed / pixelCount);
  const averageGreen = Math.round(sumGreen / pixelCount);
  const averageBlue = Math.round(sumBlue / pixelCount);

  return [averageRed, averageGreen, averageBlue];
};

// FUNCTION PER GENERARE ALBUM DETAILS
const generateDetails = (details) => {
  secondRow.innerHTML = `
  <div class="d-flex justify-content-center mt-4">
    <img src="${
      details.cover_big
    }" crossorigin="anonymous" alt="img" width="70%" id="myImg"/>
  </div>
  <div class="d-flex flex-column justify-content-end">
    <h1 class="mt-4 fs-md-4">${details.title}</h1>
    <div class="d-flex align-items-center">
      <img
        src="${details.artist.picture_big}"
        width="10%"
        class="rounded-5 me-2"
        alt="img"
      
      <p class="ms-2 mb-0 d-flex align-items-center">${details.artist.name}</p>
      <p class="ms-2 mb-0 d-flex align-items-center">${
        details.tracks.data.length
      } brani</p>
      <p class="ms-2 mb-0 d-flex align-items-center">${Math.floor(
        details.duration / 60
      )}:${details.duration % 60} </p>
    </div>
  </div>
  `;
  const myImg = document.getElementById("myImg");
  console.log(myImg);
  const bgTarget = document.getElementById("bgTarget");
  myImg.onload = function () {
    // Quando l'immagine è caricata, calcola il colore medio
    const averageColor = calculateAverageColorFromImage(myImg);
    console.log("Colore Medio:", averageColor);

    // bgTarget.style.background = `linear-gradient(to bottom, ${averageColor}, rgb(33,37,41))`;
    bgTarget.style.background = `linear-gradient(to bottom, rgb(${averageColor[0]},${averageColor[1]},${averageColor[2]}) calc(-30% + 0px), rgb(33,37,33))`;
    console.log(bgTarget);
  };

  const bgContent = document.getElementById("bgContent");
  bgContent.style.background =
    "linear-gradient(to top,rgb(0,0,0),rgba(0,0,0, 0.2)";

  const currentHeight = bgContent.offsetHeight;
  if (currentHeight < window.innerHeight) {
    bgContent.style.height = "100vh";
  }
};

// FUNCTION PER GENERARE LE TRACKS
const generateTracks = (tracks) => {
  tracks.tracks.data.forEach((el) => {
    let seconds = el.duration % 60;
    seconds = seconds.toString().padStart(2, "0");
    const options = {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    };

    const content = document.createElement("div");
    content.classList.add("d-flex", "align-items-center");
    content.innerHTML = `
    <div class="col col-md-8 d-flex justify-content-between">
       <div>
         <h6 class="mb-0">${el.title}</h6>
         <p class='text-secondary'>${el.artist.name}</p>
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
       <div class="col d-flex justify-content-end d-none d-md-flex">
          <p class="mb-0 d-none d-md-block">${Math.floor(
            el.duration / 60
          )}:${seconds}</p>
        </div>
    `;
    mainRow.appendChild(content);
  });
};

fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`)
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Errore");
    }
  })
  .then((data) => {
    console.log("Tracks", data);
    generateTracks(data);
    generateDetails(data);

    let value = data.tracks.data;

    console.log(value);
    localStorage.setItem("newTracks", JSON.stringify({ value }));
  })
  .catch((err) => {
    console.log(err);
  });

/* LOGICA PLAYER */

function espandi() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

const tracks = JSON.parse(localStorage.getItem("newTracks"));
console.log(tracks);

let index = 0

let song = tracks.value[index].preview;
console.log(song);

const audioSong= document.getElementById('uscitaAudio')
audioSong.src = song

function playA() {
  
  let song = tracks.value[index].preview;
  

  let aux = document.querySelector(".player");
  if (aux.paused || aux.currentTime === 0) {
    avviaTraccia(aux, song);
  } else {
    fermaTraccia(aux);
    avviaTraccia(aux, song);
  }
  if(aux.ended){
    index++;
    avviaTraccia(aux, song);
  }else {
    fermaTraccia(aux);
    avviaTraccia(aux, song);
  }
}

function avviaTraccia(player, traccia) {
  player.src = song;
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
let seconds = 1;
let clearIntervalID = 0;

function selectedBtnAudioColorizeGreenPrevious(event) {
  let aux = document.querySelector(".player");
  if (index > 0) {
    index = index - 1;
    song = tracks.value[index].preview;
    audioSong.src = song;

    foto.src = tracks.value[index].album.cover_big;
    foto1.src = tracks.value[index].album.cover_big;
    title.innerText = tracks.value[index].title;
    title1.innerHTML = tracks.value[index].title;
    aux.play(); 
    
  }
}

function selectedBtnAudioColorizeGreenNext(event) {
  let aux = document.querySelector(".player");
  if (index < tracks.value.length - 1) {
    index = index + 1;
    song = tracks.value[index].preview;
    audioSong.src = song;
    foto.src = tracks.value[index].album.cover_big;
    foto1.src = tracks.value[index].album.cover_big;
    title.innerText = tracks.value[index].title;
    title1.innerHTML = tracks.value[index].title;
    aux.play(); 
    clearIntervalID = 0;
    seconds = 1;
   
  }

}

function selectedModalControlDevic() {
  let modalElement = document.getElementById("modal_control-device");

  modalElement.classList.toggle("d-none");
}



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


  const foto = document.getElementById("cover-player");
  const foto1 = document.getElementById("cover-player1");
  foto.src = tracks.value[index].album.cover_big;
  foto1.src=tracks.value[index].album.cover_big;
  console.log(tracks.value[index].album.cover_big)
  const title = document.getElementById("title-song")
  const title1 = document.getElementById("title-song1")
  title.innerText = tracks.value[index].title
  title1.innerHTML= tracks.value[index].title
  console.log(tracks.value[index].title)


let newObj;

function getAudioObj(song) {
  newObj = new Audio(song);
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
