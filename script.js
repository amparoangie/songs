let songs = []
let shuffled = []
let currentIndex = 0
let sessionSeconds = 0
let sessionInterval = 0
let countdownLength = 3

const audio = document.getElementById("audioPlayer")
const songTitle = document.getElementById("songTitle")
const countdownEl = document.getElementById("countdown")
const setlistEl = document.getElementById("setlist")
const spinner = document.getElementById("spinner")

// DARK MODE TOGGLE
document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("light")
  document.getElementById("darkToggle").innerText = document.body.classList.contains("light") ? "☀️" : "🌙"
})

// LOAD SONGS
function loadSongs() {
  const fileInput = document.getElementById("songUpload")
  const files = fileInput.files
  if (!files.length) return alert("select songs first")
  spinner.style.display = "inline-block"

  setTimeout(() => {
    songs = []
    for (let file of files) {
      songs.push({ name: file.name.replace(/\.[^/.]+$/, ""), url: URL.createObjectURL(file) })
    }
    spinner.style.display = "none"
    songTitle.innerText = `${songs.length} songs loaded`
    shuffleSongs()
    renderSetlist()
  }, 300)
}

function shuffleSongs() {
  shuffled = [...songs]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  currentIndex = 0
}

// START PRACTICE
function startPractice() {
  if (!songs.length) return alert("load songs first")

  // render setlist based on checkbox at session start
  renderSetlist()

  countdownLength = parseInt(document.getElementById("countdownSelect").value)
  sessionSeconds = parseInt(document.getElementById("timeSelect").value) * 60
  startSessionTimer()
  playNext()
}

function startSessionTimer() {
  clearInterval(sessionInterval)
  sessionInterval = setInterval(() => {
    sessionSeconds--
    if (sessionSeconds <= 0) {
      clearInterval(sessionInterval)
      audio.pause()
      songTitle.innerText = "session finished"
    }
  }, 1000)
}

// NEXT SONG
function playNext() {
  if (currentIndex >= shuffled.length) {
    shuffleSongs()
  }
  const song = shuffled[currentIndex]
  currentIndex++

  countdownEl.innerText = countdownLength
  let counter = countdownLength

  const countdownInterval = setInterval(() => {
    counter--
    countdownEl.innerText = counter > 0 ? counter : ""
    if (counter <= 0) {
      clearInterval(countdownInterval)
      audio.src = song.url
      audio.play()
    }
  }, 1000)

  songTitle.innerText = song.name
}

function nextSong() {
  audio.pause()
  playNext()
}

// SETLIST
function renderSetlist() {
  if (document.getElementById("showSetlist").checked) {
    setlistEl.style.display = "block"
    setlistEl.innerHTML = ""
    songs.forEach(s => {
      const li = document.createElement("li")
      li.innerText = s.name
      setlistEl.appendChild(li)
    })
  } else {
    setlistEl.style.display = "none"
  }
}

// AUTO NEXT ON SONG END
audio.addEventListener("ended", playNext)
