// const apiKey = process.env.API_KEY;


const player = document.querySelector(".player");
const random = document.querySelector(".player .random")
const repeat = document.querySelector(".player .repeat")
const next = document.querySelector(".player .next")
const previous = document.querySelector(".player .previous")

const body = document.querySelector("body");
const currentPlaylistDisplay = document.querySelector(".current-playlist");
const playerHeader = document.querySelector(".player-header");
const bottomIcons = document.querySelector(".bottom-icons");
const viewPlaylist = document.querySelector(".controller-right-wrapper.desktop img:nth-of-type(3)")
const playlistClose = document.querySelector(".current-playlist .player-header img");
const nowPlaying = document.querySelector(".now-playing")

nowPlaying.addEventListener("click", () => {
    if (window.innerWidth >= 600) {
        body.classList.toggle("not-overflowY");
        currentPlaylistDisplay.classList.toggle("hidden");
    } else if (window.innerWidth < 600) {
        player.classList.add("open");
        body.classList.add("not-overflowY");
        playerHeader.classList.remove("hidden");
        bottomIcons.classList.remove("hidden");
    }
});



playlistClose.addEventListener("click", () => {
    body.classList.remove("not-overflowY");
    currentPlaylistDisplay.classList.add("hidden");
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
function onYouTubeIframeAPIReady() {
    iframePlayer = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: {
            playlist: currentPlaylist.map(item => item.videoId).join(','),
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

const currentTitle = document.querySelector(".player .info .title")
const currentPerformer = document.querySelector(".player .info .performer")
const currentComposer = document.querySelector(".player .info .composer")

let lastIndex = 0;

function updateNowPlaying(videoId, title, performer, composer) {
    stopVideo()
    currentVideoId = videoId
    iframePlayer.loadVideoById(currentVideoId);
    currentTitle.textContent = title;
    currentPerformer.textContent = performer;
    currentComposer.textContent = composer;
    isPlaying = true;
    addPlaylist();
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

let repeatMode = 'none';

repeat.addEventListener("click", () => {
    if (repeatMode === 'none') {
        repeatMode = true;
    } else if (repeatMode === true) {
        repeatMode = 'playlistRepeat';
    } else if (repeatMode === 'playlistRepeat') {
        repeatMode = 'none';
    }

    if (repeatMode === true) {
        repeat.src = "static/icons/repeat_one.svg";
    } else if (repeatMode === 'playlistRepeat') {
        repeat.src = "static/icons/repeat_active.svg";
    } else {
        repeat.src = "static/icons/repeat_inactive.svg";
    }
})


let login = true;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && login == false) {
        setTimeout(stopVideo, 60000);
    } else {
        if (event.data === YT.PlayerState.ENDED) {
            if (repeatMode === true) {
                iframePlayer.playVideo();
            } else if (repeatMode === 'playlistRepeat') {
                iframePlayer.setLoop(true);
            } else if (repeatMode === false) {

            }
        }
    }
};


let shuffled = false;
random.addEventListener("click", () => {
    if (!shuffled) {
        random.src = 'static/icons/random_active.svg';
        shuffled = true;
    } else {
        shuffled = false;
        random.src = 'static/icons/random_inactive.svg';
    }
    iframePlayer.setShuffle(shuffled);
})


function playNextVideo() {
    const currentIndex = iframePlayer.getPlaylistIndex();
    const nextIndex = (currentIndex + 1) % iframePlayer.length;

    player.playVideoAt(nextIndex);
}

function stopVideo() {
    isPlaying = !isPlaying;
    iframePlayer.stopVideo();
    playPause();
};

next.addEventListener("click", () => {
    updateNowPlaying()
    iframePlayer.nextVideo();
    console.log("hi")
})

let currentPlaylist = [];
let currentTrackIndex = 0;

function playNextTrack() {
    currentTrackIndex++;

    if (currentTrackIndex < playlist.length) {
        const nextTrack = playlist[currentTrackIndex];
        const nextVideoId = nextTrack.videoId;
    }
}

function addPlaylist() {
    const added = {
        videoId: currentVideoId,
        title: currentTitle.textContent,
        performer: currentPerformer.textContent,
        composer: currentComposer.textContent
    }

    currentPlaylist.push(added);

    createPlaylistElement(currentTitle.textContent, currentPerformer.textContent);
}



function createPlaylistElement(addedTitle, addedPerformer) {
    const newElement = document.createElement('div');
    newElement.classList.add('element');

    const coverWrapper = document.createElement('div');
    coverWrapper.classList.add('cover-wrapper');

    const info = document.createElement('div');
    info.classList.add('info');

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = addedTitle;

    const performer = document.createElement('div');
    performer.classList.add('performer');
    performer.textContent = addedPerformer;

    const drag = document.createElement('div');
    drag.classList.add('drag');

    const dragImage = document.createElement('img');
    dragImage.src = 'static/icons/drag.svg';

    drag.appendChild(dragImage);
    info.appendChild(title);
    info.appendChild(performer);
    newElement.appendChild(coverWrapper);
    newElement.appendChild(info);
    newElement.appendChild(drag);

    const playlistWrapper = document.querySelector('.current-playlist-wrapper');
    playlistWrapper.appendChild(newElement);

}