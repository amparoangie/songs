let songs = [];
let sessionPlaylist = [];
let currentSongIndex = 0;

const audioPlayer = document.getElementById("audioPlayer");
const songDisplay = document.getElementById("songDisplay");
const countdownDisplay = document.getElementById("countdown");
const sessionTimerDisplay = document.getElementById("sessionTimer");
const loader = document.getElementById("loader");
const setlistDiv = document.getElementById("setlist");
const progressBar = document.getElementById("songProgress");

function loadSongs(){
  const files = document.getElementById("songUpload").files;
  if(files.length === 0) return;
  loader.style.display = "block";
  songs = [];
  Array.from(files).forEach(file => {
    const url = URL.createObjectURL(file);
    songs.push({name: file.name.replace(/\.[^/.]+$/, ""), url: url, duration: 0});
  });
  let loadedCount = 0;
  songs.forEach((song, idx) => {
    const audio = new Audio();
    audio.src = song.url;
    audio.addEventListener("loadedmetadata", ()=>{
      songs[idx].duration = audio.duration;
      loadedCount++;
      if(loadedCount === songs.length){
        loader.style.display = "none";
        songDisplay.innerText = "songs loaded: " + songs.length;
      }
    });
  });
}

function startPractice(){
  const timeMinutes = parseInt(document.getElementById("timeSelect").value);
  sessionPlaylist = shuffleArray(songs);
  currentSongIndex = 0;
  startSessionTimer(timeMinutes * 60);
  playSongWithCountdown();
}

function playSongWithCountdown(){
  if(currentSongIndex >= sessionPlaylist.length){
    songDisplay.innerText = "setlist complete";
    progressBar.style.width = "0%";
    return;
  }
  const song = sessionPlaylist[currentSongIndex];
  songDisplay.innerText = song.name;

  // use selected countdown
  let countdown = parseInt(document.getElementById("countdownSelect").value);
  countdownDisplay.innerText = countdown;

  const interval = setInterval(()=>{
    countdown--;
    countdownDisplay.innerText = countdown;
    if(countdown === 0){
      clearInterval(interval);
      countdownDisplay.innerText = "";
      audioPlayer.src = song.url;
      audioPlayer.load();
      audioPlayer.play();
    }
  },1000);
}

audioPlayer.addEventListener("ended", ()=>{
  currentSongIndex++;
  playSongWithCountdown();
});

audioPlayer.addEventListener("timeupdate", ()=>{
  const percent = (audioPlayer.currentTime/audioPlayer.duration)*100;
  progressBar.style.width = percent + "%";
});

function nextSong(){
  audioPlayer.pause();
  currentSongIndex++;
  playSongWithCountdown();
}

function startSessionTimer(totalSeconds){
  clearInterval(window.sessionInterval);
  window.sessionInterval = setInterval(()=>{
    totalSeconds--;
    const mins = Math.floor(totalSeconds/60);
    const secs = totalSeconds % 60;
    sessionTimerDisplay.innerText = `session time left: ${mins}:${secs<10? '0'+secs : secs}`;
    if(totalSeconds <= 0){
      clearInterval(window.sessionInterval);
      songDisplay.innerText = "session ended";
      audioPlayer.pause();
    }
  },1000);
}

function shuffleArray(array){
  return array.sort(()=>Math.random()-0.5);
}

// Setlist toggle
document.getElementById("showSetlist").addEventListener("change", ()=>{
  if(document.getElementById("showSetlist").checked){
    setlistDiv.style.display = "block";
    setlistDiv.innerHTML = sessionPlaylist.map(s=>s.name).join("<br>");
  } else {
    setlistDiv.style.display = "none";
  }
});
