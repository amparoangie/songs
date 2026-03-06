let songs = [];
let sessionPlaylist = [];
let currentSongIndex = 0;

let sessionTimeRemaining = 0;
let sessionInterval;

let songDisplay;
let countdownDisplay;
let audioPlayer;
let sessionTimerDisplay;
let progressBar;
let setlistDiv;
let showSetlistCheckbox;

window.onload = function(){

songDisplay = document.getElementById("songDisplay");
countdownDisplay = document.getElementById("countdown");
audioPlayer = document.getElementById("audioPlayer");
sessionTimerDisplay = document.getElementById("sessionTimer");
progressBar = document.getElementById("songProgress");
setlistDiv = document.getElementById("setlist");
showSetlistCheckbox = document.getElementById("showSetlist");

// Update progress bar
audioPlayer.addEventListener("timeupdate", () => {
  if(audioPlayer.duration){
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = percent + "%";
  }
});

// Click to seek
document.getElementById("songProgressContainer").addEventListener("click", (e)=>{
  if(!audioPlayer.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
});

// Auto next song
audioPlayer.addEventListener("ended", function(){
  currentSongIndex++;
  playSongWithCountdown();
});

}

// LOAD SONGS with debug
async function loadSongs(){
const fileInput = document.getElementById("songUpload");
const files = fileInput.files;

console.log("Files selected:", files);

if(!files || files.length === 0){
  alert("Please upload songs first.");
  console.log("No files selected");
  return;
}

songs = [];
songDisplay.innerText = "loading songs...";

for(let i=0;i<files.length;i++){
  let file = files[i];
  let cleanName = file.name.replace(/\.[^/.]+$/, "");

  try {
    let duration = await getAudioDuration(file);
    songs.push({ name: cleanName, url: URL.createObjectURL(file), duration: duration });
    console.log(`Loaded song: ${cleanName}, duration: ${duration}s`);
  } catch(err){
    console.error(`Failed to load song: ${file.name}`, err);
  }
}

if(songs.length > 0){
  songDisplay.innerText = songs.length + " songs loaded";
} else {
  songDisplay.innerText = "no valid songs loaded";
  console.log("No songs successfully loaded");
}
}

// GET AUDIO DURATION
function getAudioDuration(file){
return new Promise((resolve, reject)=>{
let audio = document.createElement("audio");
audio.src = URL.createObjectURL(file);

audio.addEventListener("loadedmetadata", function(){
  resolve(audio.duration);
});

audio.addEventListener("error", function(e){
  reject(e);
});
});
}

// START PRACTICE
function startPractice(){
if(songs.length === 0){ alert("Load songs first"); return; }
buildSessionPlaylist();
currentSongIndex = 0;
startSessionTimer();
playSongWithCountdown();
}

// BUILD PLAYLIST BASED ON REAL LENGTHS
function buildSessionPlaylist(){
const minutes = document.getElementById("timeSelect").value;
const targetSeconds = minutes * 60;

let shuffled = [...songs];
for(let i = shuffled.length - 1; i > 0; i--){
  const j = Math.floor(Math.random() * (i + 1));
  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

sessionPlaylist = [];
let totalTime = 0;
for(let song of shuffled){
  if(totalTime + song.duration <= targetSeconds){
    sessionPlaylist.push(song);
    totalTime += song.duration;
  }
}

// Show setlist if checkbox enabled
if(showSetlistCheckbox.checked){
  setlistDiv.style.display = "block";
  setlistDiv.innerHTML = "<strong>setlist</strong><br><br>";
  sessionPlaylist.forEach((song,i)=>{
    setlistDiv.innerHTML += (i+1)+". "+song.name+"<br>";
  });
}else{
  setlistDiv.style.display = "none";
}
}

// SESSION TIMER
function startSessionTimer(){
const minutes = document.getElementById("timeSelect").value;
sessionTimeRemaining = minutes * 60;

clearInterval(sessionInterval);
sessionInterval = setInterval(()=>{
sessionTimeRemaining--;
const mins = Math.floor(sessionTimeRemaining/60);
const secs = sessionTimeRemaining%60;
sessionTimerDisplay.innerText = "session time left: "+ mins + ":" + secs.toString().padStart(2,'0');

if(sessionTimeRemaining <= 0){
clearInterval(sessionInterval);
audioPlayer.pause();
songDisplay.innerText = "practice finished";
countdownDisplay.innerText = "";
progressBar.style.width = "0%";
}
},1000);
}

// PLAY SONG WITH COUNTDOWN
function playSongWithCountdown(){
if(currentSongIndex >= sessionPlaylist.length){
songDisplay.innerText = "setlist complete";
progressBar.style.width = "0%";
return;
}
const song = sessionPlaylist[currentSongIndex];
songDisplay.innerText = song.name;
let countdown = 3;
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

// NEXT SONG BUTTON
function nextSong(){
audioPlayer.pause();
currentSongIndex++;
playSongWithCountdown();
}
