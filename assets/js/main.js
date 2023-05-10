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

let currentIndex = -1;
let playing = 'none';
let currentVideoId = 'none';

function updateNowPlaying() {
    currentIndex = currentPlaylist.length - 1;
    playPlayer()
    playPause();
}

function playPlayer() {
    playing = currentPlaylist[currentIndex]
    currentVideoId = playing.videoId
    iframePlayer.loadVideoById(currentVideoId);
    currentTitle.textContent = playing.title;
    currentPerformer.textContent = playing.performer;
    currentComposer.textContent = playing.composer;
    isPlaying = true;
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
                playNextVideo()
            } else if (repeatMode === 'none') {
                playNextVideo()
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
})


function playNextVideo() {
    if (currentIndex == currentPlaylist.length - 1) {
        if (repeatMode === "playlistRepeat") {
            currentIndex = 0;
            playPlayer()
            iframePlayer.playVideo();
        } else {
            currentIndex = 0;
            playPlayer();
        }
    } else {
        currentIndex += 1;
        playPlayer()
    }
}

function playPreviousVideo() {
    if (currentIndex != 0) {
        currentIndex -= 1;
        playPlayer()
    } else {
        playPlayer()
    }
}

function stopVideo() {
    isPlaying = !isPlaying;
    iframePlayer.stopVideo();
    playPause();
};

next.addEventListener("click", playNextVideo)
previous.addEventListener("click", playPreviousVideo)

let currentPlaylist = [];

function addPlaylist(videoId, title, performer, composer) {
    const added = {
        videoId: videoId,
        title: title,
        performer: performer,
        composer: composer
    }

    currentPlaylist.push(added);

    createPlaylistElement(title, performer);
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