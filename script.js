let songs = [];
let practiceSet = [];
let currentIndex = 0;

function loadSongs() {

const files = document.getElementById("songUpload").files;

songs = [];

for (let file of files){

let audio = new Audio(URL.createObjectURL(file));

audio.addEventListener("loadedmetadata", function(){

songs.push({
title: file.name,
duration: Math.ceil(audio.duration/60),
file: file
});

});

}

alert("Songs loaded!");

}

function shuffle(array) {
return array.sort(() => Math.random() - 0.5);
}

function startPractice(){

let timeLimit = parseInt(document.getElementById("timeSelect").value);

let shuffled = shuffle([...songs]);

let totalTime = 0;

practiceSet = [];

for (let song of shuffled){

if(totalTime + song.duration <= timeLimit){

practiceSet.push(song);
totalTime += song.duration;

}

}

currentIndex = 0;

nextSong();

}

function nextSong(){

if(currentIndex >= practiceSet.length){

document.getElementById("songDisplay").innerText = "Practice Finished!";
return;

}

let song = practiceSet[currentIndex];

document.getElementById("songDisplay").innerText = "Next Request: " + song.title;

currentIndex++;

}
