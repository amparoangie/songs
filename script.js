let songs=[]
let shuffledSongs=[]
let currentIndex=0

let audio=document.getElementById("audioPlayer")

let sessionSeconds=0
let sessionInterval


/* LOAD SONGS */

function loadSongs(){

const files=document.getElementById("songUpload").files
const loader=document.getElementById("loader")

if(files.length===0){
alert("please upload songs")
return
}

songs=[]
loader.style.display="block"

setTimeout(()=>{

for(let file of files){

songs.push({
name:file.name.replace(/\.[^/.]+$/,""),
file:file
})

}

loader.style.display="none"

document.getElementById("songDisplay").innerText=
songs.length+" songs loaded"

if(document.getElementById("showSetlist").checked){
displaySetlist()
}

},400)

}


/* SHUFFLE SONGS */

function shuffleSongs(){

shuffledSongs=[...songs]

for(let i=shuffledSongs.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))

let temp=shuffledSongs[i]
shuffledSongs[i]=shuffledSongs[j]
shuffledSongs[j]=temp

}

currentIndex=0

}


/* START PRACTICE */

function startPractice(){

if(songs.length===0){
alert("load songs first")
return
}

shuffleSongs()

let hours=document.getElementById("timeSelect").value

sessionSeconds=hours*60

updateSessionTimer()

sessionInterval=setInterval(()=>{

sessionSeconds--

updateSessionTimer()

if(sessionSeconds<=0){
clearInterval(sessionInterval)
}

},1000)

playSong()

}


/* PLAY SONG */

function playSong(){

let song=shuffledSongs[currentIndex]

document.getElementById("songDisplay").innerText=song.name

let countdownTime=parseInt(
document.getElementById("countdownSelect").value
)

let countdown=document.getElementById("countdown")

countdown.innerText=countdownTime

let interval=setInterval(()=>{

countdownTime--

countdown.innerText=countdownTime

if(countdownTime===0){

clearInterval(interval)

countdown.innerText=""

audio.src=URL.createObjectURL(song.file)

audio.play()

}

},1000)

}


/* NEXT SONG */

function nextSong(){

currentIndex++

if(currentIndex>=shuffledSongs.length){

shuffleSongs()

}

playSong()

}


/* AUTO NEXT */

audio.addEventListener("ended",()=>{
nextSong()
})


/* SESSION TIMER */

function updateSessionTimer(){

let minutes=Math.floor(sessionSeconds/60)
let seconds=sessionSeconds%60

document.getElementById("sessionTimer").innerText=
"session time left: "+
String(minutes).padStart(2,'0')+
":"+
String(seconds).padStart(2,'0')

}


/* SETLIST */

function displaySetlist(){

let list=document.getElementById("setlist")

list.innerHTML=""

songs.forEach(song=>{

let li=document.createElement("li")

li.innerText=song.name

list.appendChild(li)

})

}


/* SONG PROGRESS BAR */

audio.addEventListener("timeupdate",()=>{

let progress=(audio.currentTime/audio.duration)*100

document.getElementById("songProgress").value=progress

})
