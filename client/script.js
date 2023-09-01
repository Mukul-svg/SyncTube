let player;

//  This function creates an <iframe> (and YouTube player)
//  after the API code downloads.
function onYouTubeIframeAPIReady() {
  console.log("Iframe API ready");
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '',
    host: 'https://www.youtube.com',
    playerVars: {
      'playsinline': 1,
      'controls': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

//Initializing the socket
const socket = io('http://localhost:3000');

socket.on("connect", () => {
  console.log(`Connected to server`);
})

socket.on('play-video', ()=>{
  player.playVideo();
})
socket.on('pause-video', ()=>{
  player.pauseVideo();
})
socket.on('video-change', (videoId)=>{
  player.cueVideoById({videoId:videoId});
  player.playVideo();
})
socket.on('time-change', (currentTime)=>{
  player.currentTimeSliding = false;
  player.seekTo((currentTime * player.getDuration())/100, true);
})
socket.on('time-slide', ()=>{
  player.currentTimeSliding = true;
})

let url_form = document.getElementById('form');

url_form.addEventListener('submit', (e) =>{
    e.preventDefault();

    let url = document.getElementById('url').value;
    
    let videoId = YoutubeGetID(url);
    changeVideo(videoId);
})

// Function to extract Youtube ID from the URL
function YoutubeGetID(url){
    const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  console.log('The supplied URL is not a valid youtube URL');

  return '';
}

//Function for Playing Video
function startVideo() {
    player.playVideo()
    socket.emit('play-video');
}

//Function to pause Video
function pauseVideo(){
    player.pauseVideo()
    socket.emit('pause-video');
}

//Function for Volume Change
function volumeChange(volume){
    player.setVolume(volume);
}

//Functions for time change
function timeChange(currentTime){
    player.currentTimeSliding = false;
    player.seekTo((currentTime * player.getDuration())/100, true);
    socket.emit('time-change', currentTime);
}

function timeSlide(){
    player.currentTimeSliding = true;
    socket.emit('time-slide');
}

//Function to change Video
function changeVideo(videoId){
  player.cueVideoById({videoId:videoId}); 
  player.pauseVideo();
  socket.emit('video-change', videoId);
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    console.log("ready");
}

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
}

//Function for stopping video
function stopVideo() {
  player.stopVideo();
}