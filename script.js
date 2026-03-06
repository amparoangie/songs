let songs = [];
let practiceSet = [];
let currentIndex = 0;
let timeLimit = 0;
let sessionInterval;


// LOAD SONGS
function loadSongs(){

const files = document.getElementById("songUpload").files;

songs = [];

let loaded = 0;

for(let file of files){

let audio = new Audio();
audio.src = URL.createObjectURL(file);

audio.addEventListener("loadedmetadata",function(){

songs.push({
title:file.name,
duration:Math.ceil(audio.duration/60),
file:file
});

loaded++;

if(loaded === files.length){
alert(songs.length + " songs loaded!");
document.getElementById("songDisplay").innerText="Ready to start practice!";
}

});

}

}


// SHUFFLE SONGS
function shuffle(array){
return array.sort(()=>Math.random()-0.5);
}


// START PRACTICE
function startPractice(){

if(songs.length === 0){
alert("Upload songs first");
return;
}

timeLimit = parseInt(document.getElementById("timeSelect").value);

let shuffled = shuffle([...songs]);

let totalTime = 0;

practiceSet = [];

for(let song of shuffled){

if(totalTime + song.duration <= timeLimit){

practiceSet.push(song);
totalTime += song.duration;

}

}

currentIndex = 0;

startSessionTimer();

nextSong();

}


// SESSION TIMER
function startSessionTimer(){

let remainingSeconds = timeLimit * 60;

const timer = document.getElementById("sessionTimer");

sessionInterval = setInterval(()=>{

let minutes = Math.floor(remainingSeconds/60);
let seconds = remainingSeconds%60;

timer.innerText =
"Session Time Left: " +
minutes.toString().padStart(2,"0") +
":" +
seconds.toString().padStart(2,"0");

remainingSeconds--;

if(remainingSeconds < 0){

clearInterval(sessionInterval);

timer.innerText="Session Finished!";

}

},1000);

}


// NEXT SONG
function nextSong(){

if(currentIndex >= practiceSet.length){

document.getElementById("songDisplay").innerText="Practice Finished!";

document.getElementById("countdown").innerText="";

return;

}

let song = practiceSet[currentIndex];

document.getElementById("songDisplay").innerText="Next Request: " + song.title;

let countdown = document.getElementById("countdown");

let audioPlayer = document.getElementById("audioPlayer");

let count = 3;

countdown.innerText = count;

let interval = setInterval(()=>{

count--;

if(count>0){

countdown.innerText = count;

}else{

clearInterval(interval);

countdown.innerText="";

audioPlayer.src = URL.createObjectURL(song.file);

audioPlayer.play().catch(()=>{});

}

},1000);

currentIndex++;

}
