// const apiKey = process.env.API_KEY;


const player = document.querySelector(".player");
const body = document.querySelector("body");
const currentPlaylist = document.querySelector(".current-playlist");
const playerHeader = document.querySelector(".player-header");
const bottomIcons = document.querySelector(".bottom-icons");
const viewPlaylist = document.querySelector(".controller-right-wrapper.desktop img:nth-of-type(3)")
const playlistClose = document.querySelector(".current-playlist .player-header img");
const nowPlaying = document.querySelector(".now-playing")

nowPlaying.addEventListener("click", () => {
    // if (window.innerWidth >= 600) {
    //     body.classList.toggle("not-overflowY");
    //     currentPlaylist.classList.toggle("hidden");
    // } 
    if (window.innerWidth < 600) {
        player.classList.add("open");
        body.classList.add("not-overflowY");
        playerHeader.classList.remove("hidden");
        bottomIcons.classList.remove("hidden");
    }
});



playlistClose.addEventListener("click", () => {
    body.classList.remove("not-overflowY");
    currentPlaylist.classList.add("hidden");
})

const playerClose = document.querySelector(".player-header img")

playerClose.addEventListener("click", (event) => {
    event.stopPropagation(); // 이벤트 전파 막기
    player.classList.remove("open");
    body.classList.remove("not-overflowY");
    playerHeader.classList.add("hidden");
    bottomIcons.classList.add("hidden");
})

window.addEventListener("resize", () => {
    if (window.innerWidth >= 600 && player.classList.contains("open")) {
        player.classList.remove("open");
        playerHeader.classList.add("hidden");
        bottomIcons.classList.add("hidden");
    }
})



let currentPath = location.pathname;
if (currentPath !== "/profile") {
    let menuItem = document.querySelector('[href="' + currentPath + '"]').parentNode;
    menuItem.classList.add('active');
}




const playButton = document.querySelectorAll(".play")
const iframe = document.querySelector("#iframe")


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var iframePlayer;
let currentVideoId = ""
function onYouTubeIframeAPIReady() {
    iframePlayer = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: '06-puNWFuMQ',
        // videoId: currentVideoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

let isPlaying = false;

function playPause() {
    if (isPlaying) {
        playButton.forEach(btn => {
            btn.className = "pause"
            btn.src = "static/icons/pause.svg";
        })
    } else if (!isPlaying) {
        playButton.forEach(btn => {
            btn.className = "play"
            btn.src = "static/icons/play.svg";
        })
    }
}




function onPlayerReady(event) {
    console.log("hi");
    playButton.forEach(btn => {
        btn.addEventListener('click', () => {
            iframePlayer.playVideo();
            isPlaying = !isPlaying;
            if (isPlaying) {
                iframePlayer.playVideo();
            } else {
                iframePlayer.pauseVideo();
            }
            playPause();
        });
    });
}



let login = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && login == false) {
        setTimeout(stopVideo, 60000);
    }
}


function stopVideo() {
    iframePlayer.stopVideo();
}

