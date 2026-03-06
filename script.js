let songs = [];
let shuffledSongs = [];
let currentIndex = 0;
let countdownTime = 5;
let sessionSeconds = 0;
let sessionInterval;
let countdownInterval;

const audioPlayer = document.getElementById("audioPlayer");

function loadSongs() {
  const fileInput = document.getElementById("songUpload");
  const files = Array.from(fileInput.files);

  if (files.length === 0) {
    alert("Please upload some songs first!");
    return;
  }

  songs = files.map(f => ({
    name: f.name.replace(/\.[^/.]+$/, ""),
    file: URL.createObjectURL(f),
    duration: 0
  }));

  const loader = document.getElementById("loader");
  loader.style.display = "block";

  let loadedCount = 0;
  songs.forEach((song, index) => {
    const audio = new Audio();
    audio.src = song.file;
    audio.addEventListener("loadedmetadata", () => {
      song.duration = audio.duration;
      loadedCount++;
      if (loadedCount === songs.length) {
        loader.style.display = "none";
        document.getElementById("songDisplay").innerText = "songs loaded!";

        // populate setlist **only when loading songs**
        const setlistCheckbox = document.getElementById("showSetlist");
        if (setlistCheckbox.checked) displaySetlist();
      }
    });
  });
}

function displaySetlist() {
  const setlistDiv = document.getElementById("setlist");
  setlistDiv.innerHTML = songs.map((s,i)=>`${i+1}. ${s.name}`).join("<br>");
  setlistDiv.style.display = "block";
}

function startPractice() {
  if (songs.length === 0) {
    alert("Please load songs first!");
    return;
  }

  sessionSeconds = parseInt(document.getElementById("timeSelect").value) * 60;
  shuffledSongs = songs.slice().sort(() => Math.random() - 0.5);
  currentIndex = 0;
  playNextSong();

  if (sessionInterval) clearInterval(sessionInterval);
  sessionInterval = setInterval(() => {
    if (sessionSeconds > 0) {
      sessionSeconds--;
      updateSessionTimer();
    } else {
      clearInterval(sessionInterval);
      audioPlayer.pause();
      document.getElementById("songDisplay").innerText = "session finished!";
    }
  }, 1000);
}

function updateSessionTimer() {
  const minutes = Math.floor(sessionSeconds / 60).toString().padStart(2,"0");
  const seconds = (sessionSeconds % 60).toString().padStart(2,"0");
  document.getElementById("sessionTimer").innerText = `session time left: ${minutes}:${seconds}`;
}

function playNextSong() {
  if (currentIndex >= shuffledSongs.length) return;

  const song = shuffledSongs[currentIndex];
  document.getElementById("songDisplay").innerText = song.name;
  startCountdown(song);
}

function startCountdown(song) {
  clearInterval(countdownInterval);
  countdownTime = parseInt(document.getElementById("countdownSelect").value);
  const countdownDisplay = document.getElementById("countdown");
  countdownDisplay.innerText = countdownTime;

  countdownInterval = setInterval(() => {
    countdownTime--;
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.innerText = "";
      playSong(song);
    } else {
      countdownDisplay.innerText = countdownTime;
    }
  }, 1000);
}

function playSong(song) {
  audioPlayer.src = song.file;
  audioPlayer.play();
  updateProgress();

  audioPlayer.onended = () => {
    currentIndex++;
    playNextSong();
  };
}

function nextSong() {
  audioPlayer.pause();
  currentIndex++;
  if (currentIndex < shuffledSongs.length) {
    playNextSong();
  } else {
    document.getElementById("songDisplay").innerText = "session finished!";
  }
}

function updateProgress() {
  const progressBar = document.getElementById("songProgress");
  const interval = setInterval(() => {
    if (audioPlayer.duration) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
    if (audioPlayer.ended) clearInterval(interval);
  }, 200);
}
