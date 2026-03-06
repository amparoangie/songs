// script.js

let songs = [];        // all uploaded songs
let practiceSet = [];  // current practice session
let currentIndex = 0;  // index of current song
let timeLimit = 0;     // in minutes

// Load user-uploaded songs
function loadSongs() {
    const files = document.getElementById("songUpload").files;
    songs = [];
    let loadedCount = 0;

    if (files.length === 0) {
        alert("No files selected.");
        return;
    }

    // Wait for metadata to load to get duration
    for (let file of files) {
        let audio = new Audio();
        audio.src = URL.createObjectURL(file);

        audio.addEventListener("loadedmetadata", function () {
            songs.push({
                title: file.name,
                duration: Math.ceil(audio.duration / 60), // duration in minutes
                file: file
            });

            loadedCount++;
            if (loadedCount === files.length) {
                alert(`All ${songs.length} songs loaded!`);
                document.getElementById("songDisplay").innerText = "Ready to start practice!";
            }
        });
    }
}

// Simple shuffle function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start practice session
function startPractice() {
    if (songs.length === 0) {
        alert("Please upload songs first.");
        return;
    }

    timeLimit = parseInt(document.getElementById("timeSelect").value);

    let shuffled = shuffle([...songs]);
    let totalTime = 0;
    practiceSet = [];

    for (let song of shuffled) {
        if (totalTime + song.duration <= timeLimit) {
            practiceSet.push(song);
            totalTime += song.duration;
        }
    }

    currentIndex = 0;
    nextSong();
}

// Show next song with countdown and play audio
function nextSong() {
    if (currentIndex >= practiceSet.length) {
        document.getElementById("songDisplay").innerText = "Practice Finished!";
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.pause();
        audioPlayer.src = "";
        document.getElementById("countdown").innerText = "";
        return;
    }

    const song = practiceSet[currentIndex];
    document.getElementById("songDisplay").innerText = "Next Request: " + song.title;
    const countdownDiv = document.getElementById("countdown");
    countdownDiv.innerText = "3"; // start countdown

    let count = 3;
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDiv.innerText = count;
        } else {
            clearInterval(interval);
            countdownDiv.innerText = "";
            // play the song
            const audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = URL.createObjectURL(song.file);
            audioPlayer.play().catch(err => {
                console.log("Autoplay prevented. Click play to start.", err);
            });
        }
    }, 1000);

    currentIndex++;
}
