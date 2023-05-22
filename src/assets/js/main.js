const player = document.querySelector(".player");
const random = document.querySelector(".player .random")
const repeat = document.querySelector(".player .repeat")
const next = document.querySelector(".player .next")
const previous = document.querySelector(".player .previous")

const body = document.querySelector("body");
const currentPlaylistDisplay = document.querySelector(".current-playlist");
const playerHeader = document.querySelector(".player-header");
const bottomIcons = document.querySelector(".bottom-icons");
const viewPlaylist = document.querySelectorAll(".view-playlist")
const playlistClose = document.querySelector(".current-playlist .player-header img");
const nowPlaying = document.querySelector(".now-playing")


const progressBar = document.querySelector(".progress-bar")
const passed = progressBar.querySelector(".passed")
const total = progressBar.querySelector(".total")
const bar = progressBar.querySelector(".bar")
const barAfter = window.getComputedStyle(bar, "::after")
let duration = 0;

const playlistWrapper = document.querySelector('.current-playlist-wrapper');
const navAnchor = document.querySelectorAll("nav ul a");
const logoutButton = document.querySelector("button.logout");

nowPlaying.addEventListener("click", () => {
    if (window.innerWidth < 600) {
        player.classList.add("open");
        body.classList.add("not-overflowY");
        playerHeader.classList.remove("hidden");
        bottomIcons.classList.remove("hidden");
    }
});


viewPlaylist.forEach(btn => {
    btn.addEventListener("click", () => {
        bottomIcons.classList.add('hidden');
        body.classList.toggle("not-overflowY");
        currentPlaylistDisplay.classList.toggle("hidden");
        updateCurrentPlaylistScreen();
    })
})


playlistClose.addEventListener("click", () => {
    body.classList.remove("not-overflowY");
    currentPlaylistDisplay.classList.add("hidden");
    bottomIcons.classList.remove("hidden");
})

const playerClose = document.querySelector(".player-header img")

playerClose.addEventListener("click", (event) => {
    event.stopPropagation();
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


function changeNav() {
    let currentPath = location.pathname;

    navAnchor.forEach(anchor => {
        anchor.classList.remove('active');
    })

    if (currentPath !== "/profile") {
        let menuItem = document.querySelector('[href="' + currentPath + '"]');

        if (currentPath == '/') {
            menuItem = document.querySelector('nav ul a:first-of-type')
        }

        menuItem.classList.add('active');
    }
}

changeNav()

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
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
            playlist: currentPlaylist.map(item => item.videoId).join(','),
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

const currentTitle = document.querySelector(".player .info .title span")
const currentPerformer = document.querySelector(".player .info .performer span")
const currentComposer = document.querySelector(".player .info .composer span")
const currentCover = document.querySelector(".player .cover-wrapper")

let currentIndex = -1;
let playing = 'none';
let currentVideoId = 'none';

function updateNowPlaying() {
    currentIndex = currentPlaylist.length - 1;
    playPlayer();
    playPause();
}

function playPlayer() {
    playing = currentPlaylist[currentIndex]
    currentVideoId = playing.videoId
    iframePlayer.loadVideoById(currentVideoId);
    updateCurrentCover();
    currentCover.style.backgroundImage = `url(${playing.thumbnail})`;
    currentTitle.textContent = playing.title;
    currentPerformer.textContent = playing.performer;
    currentComposer.textContent = playing.composer;
    isPlaying = true;
}

const currentPlaylistList = playlistWrapper.querySelectorAll("div")

currentPlaylistList.forEach(list => {
    list.addEventListener("click", () => {
        const index = list.className
        inPlaylistPlay(index);
    })
})

function inPlaylistPlay(index) {
    currentIndex = index;
    playPlayer()
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

setInterval(progressBarAutomaticUpdate, 1000);


let loggedIn = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && loggedIn !== true) {
        duration = "1:00"
        total.textContent = duration;
        setTimeout(stopVideo, 60000);
    } else if (event.data == YT.PlayerState.PLAYING) {
        duration = iframePlayer.getDuration();
        let minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration - (60 * (Math.floor(duration / 60))))

        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60)
            minutes = minutes - (hours * 60)
            duration = `${hours}:${minutes}:${seconds}`
        } else {
            if (seconds < 10) {
                duration = `${minutes}:0${seconds}`
            } else {
                duration = `${minutes}:${seconds}`
            }
        }


        total.textContent = duration;
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
        if (event.data === YT.PlayerState.PLAYING) { }
    }
};


let shuffled = false;
random.addEventListener("click", () => {
    if (!shuffled) {
        shuffled = true
        random.src = 'static/icons/random_active.svg';
    } else {
        shuffled = false
        random.src = 'static/icons/random_inactive.svg';
    }
})

let previousIndex = 0;

function playNextVideo() {
    previousIndex = currentIndex;
    if (!shuffled) {
        if (currentIndex == currentPlaylist.length - 1) {
            if (repeatMode === "playlistRepeat") {
                currentIndex = 0;
            } else {
                currentIndex = 0;
            }
        } else {
            currentIndex += 1;
        }
    } else {
        do {
            currentIndex = Math.floor(Math.random() * (currentPlaylist.length - 1))
        } while (currentIndex === previousIndex);
    }
    playPlayer()
}


function playPreviousVideo() {
    if (!shuffled) {
        if (currentIndex != 0) {
            currentIndex -= 1;
        } else {
        }
    } else {
        currentIndex = previousIndex;
    }
    playPlayer();
}

function stopVideo() {
    isPlaying = !isPlaying;
    iframePlayer.stopVideo();
    playPause();
};

next.addEventListener("click", playNextVideo)
previous.addEventListener("click", playPreviousVideo)

let currentPlaylist = [];

function addPlaylist(videoId, title, performer, composer, thumbnail) {
    const added = {
        videoId: videoId,
        title: title,
        performer: performer,
        composer: composer,
        thumbnail: thumbnail,
    }

    currentCoverUrl = thumbnail;

    const existingIndex = currentPlaylist.findIndex(item => item.videoId === videoId);

    if (existingIndex !== -1) {
        currentPlaylist.splice(existingIndex, 1);
    }

    currentPlaylist.push(added);

    addSongHistory(videoId);

    createPlaylistElement(title, performer, thumbnail);
}



function createPlaylistElement(addedTitle, addedPerformer, addedCover, i) {
    const newElement = document.createElement('div');
    newElement.classList.add('element');

    const coverWrapper = document.createElement('div');
    coverWrapper.classList.add('cover-wrapper');
    coverWrapper.style.backgroundImage = `url(${addedCover})`

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

    newElement.className = i

    playlistWrapper.appendChild(newElement);
}

function updateCurrentPlaylistScreen() {
    playlistWrapper.innerHTML = "";
    let i = 0;
    currentPlaylist.forEach(list => {
        createPlaylistElement(list.title, list.performer, list.thumbnail, i);
        i++
    })
}



let percentage = 0;

function progressBarAutomaticUpdate() {
    let minutes = Math.floor(iframePlayer.getCurrentTime() / 60)
    let seconds = Math.trunc(iframePlayer.getCurrentTime() - (minutes * 60))

    if (loggedIn === true) {
        percentage = (Math.floor(iframePlayer.getCurrentTime()) / Math.floor(iframePlayer.getDuration())) * 100;

    } else if (loggedIn === undefined || loggedIn === false) {
        percentage = (Math.floor(iframePlayer.getCurrentTime()) / 60) * 100;
        if (iframePlayer.getCurrentTime() >= 60) {
            stopVideo();
        }
    }
    if (seconds == 0) {
        seconds = '00';
    } else if (seconds < 10) {
        seconds = `0${seconds}`
    }
    passed.textContent = `${minutes}:${seconds}`;

    bar.style.setProperty('--after-width', `${percentage}%`);
}



function updateProgressBar(event) {
    const clickedX = event.clientX - bar.getBoundingClientRect().left;
    const barWidth = bar.clientWidth;
    const progress = (clickedX / barWidth) * 100;
    if (loggedIn === true) {
        iframePlayer.seekTo(iframePlayer.getDuration() * (progress * 0.01));
    } else {
        iframePlayer.seekTo(60 * (progress * 0.01));
    }

    bar.style.setProperty('--after-width', `${progress}%`)

}


bar.addEventListener('click', updateProgressBar);

let currentCoverUrl = "";

function getCover(url) {

}

function updateCurrentCover() {
    const covers = document.querySelectorAll(".player .cover-wrapper");

    covers.forEach((cover) => {
        cover.style.backgroundImage = `url(${currentCoverUrl})`;
    })
}


// soundbar 

const soundbarContainer = document.querySelector(".soundbar-container");
const soundbarWrapper = document.querySelector('.soundbar-wrapper');
const soundbar = document.querySelector('.soundbar');
const soundHeightVariable = '--sound-height';

let isDragging = false;

soundbarWrapper.addEventListener('mousedown', startDrag);
soundbarWrapper.addEventListener('touchstart', startDrag);
document.addEventListener('mousemove', handleDrag);
document.addEventListener('touchmove', handleDrag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function startDrag(event) {
    isDragging = true;
    event.preventDefault();
    updateSoundHeight(event);
}

function handleDrag(event) {
    if (isDragging) {
        event.preventDefault();
        updateSoundHeight(event);
        showSoundbar()
    }
}

function stopDrag() {
    isDragging = false;
}

const soundIcon = document.querySelector('.sound')
let newSoundHeight = 0;

function updateSoundHeight(event) {
    const soundbarHeight = soundbarWrapper.offsetHeight;
    const rect = soundbarWrapper.getBoundingClientRect();
    const offsetY = event.clientY;
    let relativeY = rect.bottom - offsetY;
    const clampedRelativeY = Math.max(0, Math.min(relativeY, soundbarHeight));
    let percentage = ((clampedRelativeY / soundbarHeight) * 100);
    newSoundHeight = `${Math.floor(relativeY)}px`;

    if (!isMuted) {
        if (Math.floor(relativeY) > 60) {
            newSoundHeight = '60px';
        }
    }
    soundbar.style.setProperty(soundHeightVariable, newSoundHeight);

    const volume = percentage;
    iframePlayer.setVolume(volume);

}

let isMuted = false
let previousVolume = 0;

soundIcon.addEventListener("click", (event) => {
    let previousHeight = newSoundHeight;
    if (!isMuted) {
        isMuted = true;
        soundIcon.src = "static/icons/mute.svg";
        previousVolume = iframePlayer.getVolume();
        iframePlayer.setVolume(0);
        soundbar.style.setProperty(soundHeightVariable, 0);
    } else {
        soundIcon.src = "static/icons/sound.svg";
        iframePlayer.setVolume(previousVolume);
        soundbar.style.setProperty(soundHeightVariable, previousHeight);
    }
})

function showSoundbar() {
    soundbarContainer.style.height = '100px';
    soundbarContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
    soundbarContainer.style.marginBottom = '73px';
    soundbarWrapper.style.display = "flex";
}

function hideSoundbar() {
    soundbarContainer.style.height = '27px'
    soundbarContainer.style.backgroundColor = 'transparent'
    soundbarContainer.style.marginBottom = '0';
    soundbarWrapper.style.display = "none"
}

soundbarContainer.addEventListener("mouseover", showSoundbar)
soundbarContainer.addEventListener("mouseleave", hideSoundbar)


// main tag update 

function navigateToPage(url) {
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newMainContent = doc.querySelector("main");
            const newHeaderContent = doc.querySelector("header");

            const currentMain = document.querySelector("main")
            const currentHeader = document.querySelector("header")

            currentMain.innerHTML = "";
            currentHeader.innerHTML = "";

            currentMain.innerHTML = newMainContent.innerHTML;
            currentHeader.innerHTML = newHeaderContent.innerHTML;
            pageTitle = url.charAt(0);
            changeNav();
        })
        .catch((error) => {
            console.error(error);
        });
}

navAnchor.forEach((anchor) => {
    currentPlaylistDisplay.classList.add("hidden");
    anchor.addEventListener("click", (event) => {
        const mainContent = document.querySelector("main");
        event.preventDefault();
        const url = anchor.getAttribute("href");
        navigateToPage(url);
        window.history.pushState({}, "", url);
    });
});

const logo = document.querySelector(".logo")

logo.addEventListener("click", (event) => {
    const mainContent = document.querySelector("main");
    event.preventDefault();
    const url = "/"
    navigateToPage(url);
    window.history.pushState({}, "", url);
})

const profile = document.querySelector("header .profile-wrapper")

profile.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "/profile"
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const mainContent = doc.querySelector("main").innerHTML;
            const docMain = document.querySelector("main");
            docMain.innerHTML = mainContent;
            pageTitle = url.charAt(0)
            changeNav();
        })
        .catch((error) => {
            console.error(error);
        });
    window.history.pushState({}, "", url);
}, true)

window.addEventListener("popstate", () => {
    const url = window.location.href;
    navigateToPage(url);
});

if (location.pathname == '/profile') {
    logoutButton.addEventListener('click', async () => {
        console.log("worked");
        try {
            await fetch('/logout', {
                method: 'POST',
            });
            addPlaylistHistory();

            location.reload();
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    });
}



function checkLogin() {
    return new Promise((resolve, reject) => {
        fetch('/getLoginStatus')
            .then(response => response.json())
            .then(data => {
                loggedIn = data.loggedIn;
                resolve();
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

window.onload = () => {
    checkLogin().then(() => {
        // console.log(loggedIn);
    });
};

function addSongHistory(videoId) {
    fetch('/addSongToHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
    })
        .then((response) => {
            if (response.ok) {
                // console.log('Song added to history successfully');
            } else {
                console.error('Failed to add song to history');
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function addPlaylistHistory() {
    const playlist = Object.values(currentPlaylist).map(song => song.videoId);

    fetch('/addPlaylistToHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlist }),
    })
        .then((response) => {
            if (response.ok) {
                console.log('playlist added to history successfully');
            } else {
                console.error('Failed to add playlist to history');
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function searchComposer(name) {
    const keyword = name

    const searchUrl = new URL("/search", window.location.origin);
    searchUrl.searchParams.set("keyword", keyword);

    window.location.href = searchUrl.href;
}


