let songs=[]
let shuffled=[]
let currentIndex=0

let audio=document.getElementById("audioPlayer")
let songDisplay=document.getElementById("songDisplay")
let countdownDisplay=document.getElementById("countdown")
let sessionTimer=document.getElementById("sessionTimer")
let progress=document.getElementById("songProgress")

let countdownLength=3
let sessionSeconds=0
let sessionInterval

/* DARK MODE TOGGLE */

window.addEventListener("DOMContentLoaded",()=>{

let toggle=document.getElementById("darkToggle")

toggle.addEventListener("click",()=>{

document.body.classList.toggle("light")

toggle.innerText=
document.body.classList.contains("light")
? "☀️"
: "🌙"

})

})

/* LOAD SONGS */

function loadSongs(){

let loader=document.getElementById("loader")
let fileInput=document.getElementById("songUpload")
let files=fileInput.files

songs=[]
loader.style.display="block"

setTimeout(()=>{

for(let file of files){

let url=URL.createObjectURL(file)

songs.push({
name:file.name.replace(/\.[^/.]+$/,""),
url:url
})

}

loader.style.display="none"

songDisplay.innerText=songs.length+" songs loaded"

prepareSetlist()

},500)

}

/* SHUFFLE */

function shuffle(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))
[array[i],array[j]]=[array[j],array[i]]

}

return array

}

/* SETLIST */

function prepareSetlist(){

shuffled=shuffle([...songs])
currentIndex=0

let list=document.getElementById("setlist")
list.innerHTML=""

if(document.getElementById("showSetlist").checked){

shuffled.forEach(song=>{
let li=document.createElement("li")
li.innerText=song.name
list.appendChild(li)
})

}

}

/* START SESSION */

function startPractice(){

if(songs.length===0){
alert("load songs first")
return
}

countdownLength=
parseInt(document.getElementById("countdownSelect").value)

let minutes=
parseInt(document.getElementById("timeSelect").value)

sessionSeconds=minutes*60

startSessionTimer()

playNext()

}

/* SESSION TIMER */

function startSessionTimer(){

sessionInterval=setInterval(()=>{

sessionSeconds--

let min=Math.floor(sessionSeconds/60)
let sec=sessionSeconds%60

sessionTimer.innerText=
"session time left: "+min+":"+String(sec).padStart(2,"0")

if(sessionSeconds<=0){

clearInterval(sessionInterval)
audio.pause()
songDisplay.innerText="session finished"

}

},1000)

}

/* NEXT SONG */

function playNext(){

if(currentIndex>=shuffled.length){

shuffled=shuffle([...songs])
currentIndex=0

}

let song=shuffled[currentIndex]

songDisplay.innerText=song.name

startCountdown(song)

currentIndex++

}

/* COUNTDOWN */

function startCountdown(song){

let time=countdownLength

countdownDisplay.innerText=time

let interval=setInterval(()=>{

time--

if(time<=0){

clearInterval(interval)
countdownDisplay.innerText=""

audio.src=song.url
audio.play()

}else{

countdownDisplay.innerText=time

}

},1000)

}

/* AUTO NEXT */

audio.addEventListener("ended",()=>{
playNext()
})

/* NEXT BUTTON */

function nextSong(){

audio.pause()
playNext()

}

/* SONG PROGRESS */

audio.addEventListener("timeupdate",()=>{

let percent=(audio.currentTime/audio.duration)*100
progress.value=percent

}) 
