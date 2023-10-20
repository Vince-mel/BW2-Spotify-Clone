fetch("https://striveschool-api.herokuapp.com/api/deezer/album/329470657")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Errore");
    }
  })
  .then((data) => {
    console.log("Album:", data);
  })
  .catch((err) => {
    console.log(err);
  });

fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=nayeon")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Errore");
    }
  })
  .then((data) => {
    console.log("Search", data);
  })
  .catch((err) => {
    console.log(err);
  });

fetch("https://striveschool-api.herokuapp.com/api/deezer/artist/13601441")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Errore");
    }
  })
  .then((data) => {
    console.log("Artisti:", data);
  })
  .catch((err) => {
    console.log(err);
  });

fetch(
  "https://striveschool-api.herokuapp.com/api/deezer/artist/13601441/top?limit=50"
)
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Errore");
    }
  })
  .then((data) => {
    console.log("Tracklist", data);
  })
  .catch((err) => {
    console.log(err);
  });
