let songs = []
let shuffled = []
let currentIndex = 0
let sessionSeconds = 0
let sessionInterval = null
let countdownLength = 3

const audio = document.getElementById("audioPlayer")
const songTitle = document.getElementById("songTitle")
const countdownEl = document.getElementById("countdown")
const setlistEl = document.getElementById("setlist")
const spinner = document.getElementById("spinner")

// DARK MODE TOGGLE
document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("light")
  document.getElementById("darkToggle").innerText =
    document.body.classList.contains("light") ? "☀️" : "🌙"
})

// LOAD SONGS
function loadSongs() {
  const fileInput = document.getElementById("songUpload")
  const files = fileInput.files
  if (!files.length) return alert("Select songs first")
  spinner.style.display = "inline-block"

  setTimeout(() => {
    songs = []
    for (let file of files) {
      songs.push({
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file)
      })
    }
    spinner.style.display = "none"
    songTitle.innerText = `${songs.length} songs loaded`
    renderSetlist()
  }, 300)
}

// SHUFFLE
function shuffleSongs() {
  shuffled = [...songs]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  currentIndex = 0
}

// START PRACTICE
function startPractice() {
  if (!songs.length) return alert("Load songs first")
  shuffleSongs()
  countdownLength = parseInt(document.getElementById("countdownSelect").value)
  sessionSeconds = parseInt(document.getElementById("timeSelect").value) * 60
  startSessionTimer()
  renderSetlist()
  playNext() // triggers countdown then audio.play()
}

// SESSION TIMER
function startSessionTimer() {
  clearInterval(sessionInterval)
  sessionInterval = setInterval(() => {
    sessionSeconds--
    if (sessionSeconds <= 0) {
      clearInterval(sessionInterval)
      audio.pause()
      songTitle.innerText = "Session finished"
    }
  }, 1000)
}

// PLAY NEXT
function playNext() {
  if (currentIndex >= shuffled.length) shuffleSongs()
  const song = shuffled[currentIndex++]

  countdownEl.innerText = countdownLength
  let counter = countdownLength

  const interval = setInterval(() => {
    counter--
    countdownEl.innerText = counter > 0 ? counter : ""
    if (counter <= 0) {
      clearInterval(interval)
      audio.src = song.url
      audio.play() // triggered by user gesture Start Practice
    }
  }, 1000)

  songTitle.innerText = song.name
}

// NEXT BUTTON
function nextSong() {
  audio.pause()
  playNext()
}

// RENDER SETLIST
function renderSetlist() {
  if (document.getElementById("showSetlist").checked) {
    setlistEl.style.display = "block"
    setlistEl.innerHTML = ""
    songs.forEach(s => {
      const li = document.createElement("li")
      li.innerText = s.name
      setlistEl.appendChild(li)
    })
  } else setlistEl.style.display = "none"
}

// AUTO NEXT ON SONG END
audio.addEventListener("ended", playNext)
