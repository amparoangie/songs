let songs = [];
let sessionPlaylist = [];
let currentSongIndex = 0;

let sessionTimeRemaining = 0;
let sessionInterval;

const songDisplay = document.getElementById("songDisplay");
const countdownDisplay = document.getElementById("countdown");
const audioPlayer = document.getElementById("audioPlayer");
const sessionTimerDisplay = document.getElementById("sessionTimer");


// LOAD SONGS
function loadSongs(){

    const files = document.getElementById("songUpload").files;

    if(files.length === 0){
        alert("Please upload songs first.");
        return;
    }

    songs = [];

    for(let i = 0; i < files.length; i++){

        let cleanName = files[i].name.replace(/\.[^/.]+$/, "");

        songs.push({
            name: cleanName,
            url: URL.createObjectURL(files[i]),
            file: files[i]
        });

    }

    songDisplay.innerText = songs.length + " songs loaded.";

}



// START PRACTICE
function startPractice(){

    if(songs.length === 0){
        alert("Load songs first.");
        return;
    }

    buildSessionPlaylist();

    currentSongIndex = 0;

    startSessionTimer();

    playSongWithCountdown();

}



// BUILD PLAYLIST BASED ON SESSION LENGTH
function buildSessionPlaylist(){

    const minutes = document.getElementById("timeSelect").value;

    const averageSongLength = 3; // minutes

    const numberOfSongs = Math.ceil(minutes / averageSongLength);

    let shuffled = [...songs];

    for(let i = shuffled.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

    }

    sessionPlaylist = shuffled.slice(0, numberOfSongs);

}



// SESSION TIMER
function startSessionTimer(){

    const minutes = document.getElementById("timeSelect").value;

    sessionTimeRemaining = minutes * 60;

    clearInterval(sessionInterval);

    sessionInterval = setInterval(()=>{

        sessionTimeRemaining--;

        const mins = Math.floor(sessionTimeRemaining / 60);
        const secs = sessionTimeRemaining % 60;

        sessionTimerDisplay.innerText =
        "Session Time Left: " +
        mins + ":" + secs.toString().padStart(2,'0');

        if(sessionTimeRemaining <= 0){

            clearInterval(sessionInterval);

            audioPlayer.pause();

            songDisplay.innerText = "Practice Finished";

            countdownDisplay.innerText = "";

        }

    },1000);

}



// PLAY SONG WITH COUNTDOWN
function playSongWithCountdown(){

    if(currentSongIndex >= sessionPlaylist.length){

        songDisplay.innerText = "Setlist Complete";

        return;

    }

    const song = sessionPlaylist[currentSongIndex];

    songDisplay.innerText = song.name;

    let countdown = 3;

    countdownDisplay.innerText = countdown;

    const countdownInterval = setInterval(()=>{

        countdown--;

        countdownDisplay.innerText = countdown;

        if(countdown === 0){

            clearInterval(countdownInterval);

            countdownDisplay.innerText = "";

            audioPlayer.src = song.url;

            audioPlayer.load();

            audioPlayer.play();

        }

    },1000);

}



// MANUAL NEXT SONG
function nextSong(){

    audioPlayer.pause();

    currentSongIndex++;

    playSongWithCountdown();

}



// AUTO NEXT SONG WHEN AUDIO ENDS
audioPlayer.addEventListener("ended", function(){

    currentSongIndex++;

    playSongWithCountdown();

});
